/* eslint-disable @next/next/no-img-element */
import { Holistic } from "@mediapipe/holistic";
import { useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import DefaultLayout from "/components/layouts/DefaultLayout";
import { useRouter } from "next/router";
import { extractKeypoints } from "/utils/ai/extractKeypoints";
import * as tf from "@tensorflow/tfjs";
import { SourcePicker } from "@mediapipe/control_utils";
import { BubbleButton } from "/components/elements/button";
import * as actions from "/utils/constants/actions";

const modelVersion = process.env.NEXT_PUBLIC_MODEL_VERSION || "v8";
const modelInputSequenceLength =
  Number(process.env.NEXT_PUBLIC_MODEL_INPUT_SEQUENCE_LENGTH) || 23;
const modelPredictionSkipLength =
  Number(process.env.NEXT_PUBLIC_MODEL_PREDICTION_SKIP_LENGTH) || 5;

let ACTIONS;
if (modelVersion === "v6") {
  ACTIONS = actions.ACTIONSV6;
} else if (modelVersion === "v7") {
  ACTIONS = actions.ACTIONSV7;
} else if (modelVersion === "v8") {
  ACTIONS = actions.ACTIONSV8;
}

function HomeManual() {
  const router = useRouter();
  const videoRef = useRef();

  const [holistic, setHolistic] = useState();
  const [deviceIdx, setDeviceIdx] = useState();
  const [devices, setDevices] = useState([]);

  const [sequence, setSequnce] = useState([]);
  const [step, setStep] = useState(0);

  // load model and save to localstorage
  const [model, setModel] = useState();
  useEffect(() => {
    // TODO: set to environtment variable
    (async function () {
      let model;
      const dbpath = `indexeddb://model${modelVersion}`;
      const publicpath = `/ai/${modelVersion}/model.json`;

      try {
        model = await tf.loadLayersModel(dbpath);
        console.info(`model ${modelVersion} loaded from indexeddb`);
      } catch (error) {
        const model = await tf.loadLayersModel(publicpath);
        await model.save(`indexeddb://model${modelVersion}`);
        console.info(`model ${modelVersion} loaded from public`);
      } finally {
        setModel(model);
      }
    })();
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(({ kind }) => kind === "videoinput");
      if (videoDevices.length === 0) {
        alert("video input is not accessible!");
        return;
      }
      setDevices(videoDevices);
      // console.log(videoDevices);

      const idx = Number(localStorage.getItem("deviceIdx")) || 0;
      if (idx < videoDevices.length) setDeviceIdx(idx);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (holistic) holistic.close();
      const holistic = createHolistic();
      setHolistic(holistic);
    }, 2000);
  }, []);

  const createHolistic = () => {
    const hol = new Holistic({
      locateFile: (file) => {
        return `/holistic/${file}`;
      },
    });

    hol.setOptions({
      modelComplexity: 0.5,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    return hol;
  };

  // PREDICTION: extract keypoint
  const [predictions, setPredictions] = useState([]);
  useEffect(() => {
    (async function () {
      if (!holistic) return;
      if (!videoRef?.current?.video) return;

      holistic.onResults((results) => {
        setStep((s) => s + 1);
        // const s = sequence;
        setSequnce((s) => {
          if (s.length === modelInputSequenceLength) s.shift();
          const keypoints = extractKeypoints(results);
          return [...s, keypoints];
        });
      });
    })();
  }, [holistic, model, sequence, step]);

  // PREDICTION: predict
  useEffect(() => {
    if (
      !model ||
      sequence.length !== modelInputSequenceLength ||
      step % modelPredictionSkipLength != 0
    )
      return;

    const restf = model.predict(tf.tensor([sequence]));
    const index = indexOfMax(Array.from(restf.dataSync()));
    const pred = ACTIONS[index];

    // console.log(pred);
    if (pred === "NOTHING" || !pred) return;

    if (predictions.length === 0 || predictions.at(-1) !== pred) {
      setPredictions([...predictions, pred]);
    }
  }, [model, predictions, sequence, step]);

  const deviceId = useMemo(() => {
    return devices[deviceIdx]?.deviceId;
  }, [deviceIdx, devices]);

  // Mediapipe Sender
  useEffect(() => {
    if (!holistic) return;
    if (!videoRef?.current?.video) return;
    if (document.querySelectorAll(".control-panel-source-picker").length > 0)
      return;

    new SourcePicker({
      onFrame: async (image, size) => {
        if (size.height === 0 || size.width === 0) return;
        try {
          await holistic.send({ image: image });
        } catch (error) {
          console.error(error);
        }
      },
    }).create(() => {}, {}, document.querySelector("#mediapipe-sender"));
  }, [holistic, deviceIdx]);

  const mediapipeSenderRef = useRef();
  useEffect(() => {
    if (!deviceIdx) return;
    if (!mediapipeSenderRef.current) return;

    const interval = setInterval(() => {
      const list = document.querySelector(
        ".control-panel-source-picker .dropdown-options",
      )?.children;
      if (list) {
        list[deviceIdx].click();
        clearInterval(interval);
      }
    }, 1000);
  }, [deviceIdx]);

  return (
    <DefaultLayout>
      <div className="container mx-auto py-4 lg:space-y-2">
        <div className="flex items-center space-x-2 fixed bottom-[40px] lg:static z-40 left-[20px] right-[20px] md:left-[80px] md:right-[80px]">
          <div
            role="button"
            className="w-14 h-14 bg-white rounded-full px-2 hover-bubble"
            onClick={() => {
              const n = devices.length;
              if (deviceIdx === n - 1) {
                localStorage.setItem("deviceIdx", "0");
                setDeviceIdx(0);
              } else {
                setDeviceIdx((idx) => {
                  localStorage.setItem("deviceIdx", idx + 1 + "");
                  return idx + 1;
                });
              }
              router.reload();
            }}
          >
            <img
              src="/icon/switch-cam.svg"
              alt="switch camera"
              className="w-full h-full"
            />
          </div>

          <div className="px-4 py-4 w-full bg-grad-dana rounded-lg text-white font-medium text-xl border-2 border-opacity-40 border-white lg:border-none capitalize tracking-wide">
            {predictions.length === 0 ? "-" : predictions.join("  ")}
          </div>
          <BubbleButton text="Reset" onClick={() => setPredictions([])} />
        </div>
        <div className="w-screen h-screen-no-header fixed left-0 top-header lg:static lg:w-full lg:h-full lg:rounded-lg overflow-hidden bg-c-dana max-h-screen-no-header">
          {/* pppp */}
          <Webcam
            ref={videoRef}
            videoConstraints={{
              deviceId: deviceId,
            }}
            // TODO: create mirror controller
            mirrored={true}
            className="w-full object-center object-cover"
          ></Webcam>
        </div>
      </div>

      {/* video sender */}
      <div
        id="mediapipe-sender"
        className="hidden"
        ref={mediapipeSenderRef}
      ></div>
    </DefaultLayout>
  );
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

export default HomeManual;

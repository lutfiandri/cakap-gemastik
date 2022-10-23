import { useState } from "react";
import { Video } from "/components/elements/video";
import DefaultLayout from "/components/layouts/DefaultLayout";
import { BackgroundDecoration } from "/components/elements/decoration/BackgroundDecoration";
import { DICT_ITEMS } from "/utils/constants";
import Image from "next/image";
import { BubbleButton } from "/components/elements/button";

function Translate() {
  let i = 0;
  let interval;
  const [videoTranslate, setVideoTranslate] = useState([]);
  const [focusVideo, setFocusVideo] = useState("");

  const handleTranslate = () => {
    clearInterval(interval);
    i = 0;
    const tempTranslate = [];
    const text = document.getElementById("text-translate");
    const tempText = text.value.toLowerCase();
    const array = tempText.split(" ");
    array.forEach((word) => {
      const obj = DICT_ITEMS.find((o) => o.label === word);
      if (obj === undefined) {
        const temp = word.split("");
        temp.forEach((char) => tempTranslate?.push(char));
      } else {
        tempTranslate?.push(word);
      }
    });
    setVideoTranslate(tempTranslate);
    setFocusVideo(tempTranslate[0] ?? "");
    interval = setInterval(() => {
      i++;
      if (i >= tempTranslate.length) {
        i = 0;
      }
      setFocusVideo(tempTranslate[i] ?? "");
    }, 2500);
  };

  return (
    <DefaultLayout title="Translate Bisindo - Cakap">
      <div className="flex flex-row justify-center justify-items-center place-items-center min-h-screen-no-header md:py-8 xl:my-0">
        <div className="flex flex-row justify-center justify-items-center place-items-center flex-wrap">
          {/* Translate box */}
          <div className="flex flex-col self-start mx-4 text-white drop-shadow-md">
            <div className="md:h-[50vh] h-[30vh] w-[75vw] lg:w-auto border-0 rounded-xl">
              <textarea
                className="md:h-[50vh] h-[30vh] w-[75vw] lg:w-auto bg-grad-dana bg-opacity-50 border-0 rounded-xl p-6"
                rows="4"
                cols="50"
                id="text-translate"
                name="translate"
                placeholder="input text here..."
              ></textarea>
            </div>

            <div className="w-full">
              <BubbleButton
                id="translate"
                className="!w-full text-center rounded-2xl mt-3 h-12 text-lg font-semibold font-poppins text-white"
                onClick={handleTranslate}
                text="Translate"
              />
            </div>
          </div>
          {/* video translate */}
          <div className="flex flex-col mx-5 w-[75vw] lg:w-[50vw] my-12 self-start">
            <div className="h-auto w-[75vw] lg:w-[50vw]  flex">
              {focusVideo !== "" ? (
                <Video
                  key={focusVideo}
                  src={`/dictionary/${focusVideo}.mp4`}
                  label={focusVideo}
                  labelInside
                  autoStart
                  Id="OneVideo"
                />
              ) : (
                <div className="flex relative isolate overflow-hidden shadow-xl rounded-xl w-[75vw] lg:w-[50vw] bg-c-clips md:h-[50vh] h-[30vh] justify-center ">
                  <div className="flex justify-items-center place-items-center content-center">
                    <Image
                      src="/icon/playVideo.svg"
                      height={200}
                      width={200}
                      alt="play-video"
                    />
                  </div>
                </div>
              )}
            </div>
            {/* 5 Video */}
            <div className="container relative  mt-5 max-w-[75vw] lg:max-w-[50vw] overflow-x-auto whitespace-nowrap">
              {videoTranslate?.map((video, index) => {
                let source = "";
                let label = "";
                if (video !== ".") {
                  source = `/dictionary/${video}.mp4`;
                  label = video;
                }
                return (
                  <div
                    className="lg:w-[9vw] w-[14vw] inline-block whitespace-normal mr-4"
                    key={index}
                  >
                    <Video key={source} src={source} label={label} autoStart />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BackgroundDecoration />
    </DefaultLayout>
  );
}
export default Translate;

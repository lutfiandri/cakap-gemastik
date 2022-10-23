import { RenderIf } from "../RenderIf";
import { HiPlay } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export function Video({ src, label, labelInside = false, autoStart, onClick }) {
  const videoRef = useRef();

  const [isPlayed, setIsPlayed] = useState(false);

  useEffect(() => {
    if (autoStart) {
      videoRef.current.play();
      setIsPlayed(true);
    }
  }, [src, autoStart]);

  const clickHandler = () => {
    if (!isPlayed) {
      setIsPlayed(true);
      videoRef.current.play();
    } else {
      setIsPlayed(false);
      videoRef.current.pause();
    }
  };

  return (
    <div>
      <div
        role="button"
        className="relative isolate overflow-hidden shadow-xl rounded-xl "
        onClick={onClick ? onClick : clickHandler}
      >
        <video
          muted
          loop
          ref={videoRef}
          className="aspect-video object-cover object-center w-full h-full"
        >
          <source src={src} />
        </video>
        <HiPlay
          className={clsx(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow duration-150 max-w-[70px]",
            isPlayed ? "w-0 h-0 opacity-10" : "w-full h-[40%] opacity-75",
          )}
        />
        <RenderIf when={label && labelInside}>
          <div className="absolute left-0 top-0 px-6 py-2 bg-c-clips font-medium text-center capitalize bg-opacity-60 backdrop-blur-sm rounded-br-xl min-w-[40%]">
            <span className="text-white drop-shadow-md">{label}</span>
          </div>
        </RenderIf>
      </div>
      <RenderIf when={label && !labelInside}>
        <div className="mt-2 font-medium text-center capitalize">{label}</div>
      </RenderIf>
    </div>
  );
}

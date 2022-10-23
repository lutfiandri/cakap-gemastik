import clsx from "clsx";

export function BubbleButton({ text, bgGreen, onClick, className }) {
  return (
    <div
      role="button"
      onClick={onClick}
      className={clsx(
        "px-6 py-2 rounded-full font-medium text-white w-fit hover-bubble",
        bgGreen ? "bg-grad-blue" : "bg-grad-dana",
        className,
      )}
    >
      <span className="drop-shadow-md capitalize">{text}</span>
    </div>
  );
}

import clsx from "clsx";
import { HiSearch } from "react-icons/hi";

export function SearchBar({
  search,
  setSearch,
  className,
  placeholder = "cari...",
}) {
  return (
    <div className="group w-full md:w-[300px] flex items-center rounded-full border border-gray-300 shadow-sm  focus:border-indigo-300 px-4 text-c-clips bg-white">
      <HiSearch className="w-6 h-6 " />
      <input
        type="text"
        className={clsx("block w-full border-0 focus:ring-0", className)}
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

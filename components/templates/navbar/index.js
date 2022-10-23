import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

const routes = [
  {
    path: "/",
    name: "Recognition",
    key: "recognition",
  },
  {
    path: "/dictionary",
    name: "Dictionary",
    key: "dictionary",
  },
  {
    path: "/translate",
    name: "Translate",
    key: "translate",
  },
  {
    path: "/guide",
    name: "Guide",
    key: "guide",
  },
];

export const Navbar = ({ setIsGuideOpen }) => {
  const [dropDown, setDropDown] = useState(false);
  const router = useRouter();

  return (
    <nav className="bg-white px-2 sm:px-4 rounded border-b-4 py-4 border-c-05">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link href="/" className="flex items-center">
          <a className="flex">
            <div className="flex justify-items-center place-items-center content-center mr-2">
              <Image
                src={"/android-chrome-192x192.png"}
                alt="Tutur"
                width={40}
                height={40}
              />
            </div>
            <span className="self-center whitespace-nowrap text-2xl text-c-05 font-bold">
              Tutur
            </span>
          </a>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 "
          aria-controls="navbar-default"
          aria-expanded="false"
          onClick={() => setDropDown(!dropDown)}
        >
          <Image src={"/icon/List.svg"} width={20} height={20} alt="List" />
        </button>
        <div
          className={`w-full md:flex md:items-center md:w-auto md:flex-row ${
            dropDown ? "" : "hidden"
          }`}
          id="menu"
        >
          <ul
            className="
              relative
              pt-4
              text-base text-gray-700
              md:flex
              md:justify-between 
              md:pt-0"
          >
            {routes.map((route) => {
              return (
                <div
                  className="mx-5 flex"
                  key={route.key}
                  role="button"
                  onClick={() => {
                    if (route.key === "guide") {
                      setIsGuideOpen((g) => !g);
                    } else {
                      router.push(route.path);
                    }
                  }}
                >
                  <div className="flex justify-items-center place-items-center content-center mr-1">
                    <Image
                      src={`/icon/${route.name}.svg`}
                      height={20}
                      width={20}
                      alt={route.name}
                    />
                  </div>
                  <span className="self-center font-poppins whitespace-nowrap text-lg text-c-05 font-semibold">
                    {route.name}
                  </span>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

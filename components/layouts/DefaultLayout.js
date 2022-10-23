import Head from "next/head";
import { useState } from "react";
import { Guide } from "../templates/guide";
import { Navbar } from "../templates/navbar";

function DefaultLayout({ children, title = "Cakap" }) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <header>
        <Navbar setIsGuideOpen={setIsGuideOpen} />
      </header>
      <main>{children}</main>
      <Guide isOpen={isGuideOpen} setIsOpen={setIsGuideOpen} />
    </>
  );
}

export default DefaultLayout;

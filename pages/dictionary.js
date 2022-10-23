import DefaultLayout from "/components/layouts/DefaultLayout";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Video } from "/components/elements/video";
import { RenderIf } from "/components/elements/RenderIf";
import { BackgroundDecoration } from "/components/elements/decoration/BackgroundDecoration";
import { useTailwindBreakpoint } from "/utils/hooks/useTailwindBreakpoint";
import {
  DesktopCategory,
  MobileCategories,
} from "/components/templates/dictionary";
import { BubbleButton } from "/components/elements/button";
import { SearchBar } from "/components/elements/SearchBar";
import { CATEGORIES, DICT_ITEMS } from "/utils/constants";

function Dictionary() {
  const router = useRouter();
  const { category } = router.query;

  const { isMd, isLg, isXl, is2Xl } = useTailwindBreakpoint();

  const [search, setSearch] = useState("");

  const [playedLabel, setPlayedLabel] = useState("1");

  const filteredDictItems = useMemo(() => {
    const filteredByCategory = DICT_ITEMS.filter((item) => {
      if (!category) return true;
      return item.category === category;
    });
    const filteredBySearch = filteredByCategory.filter((item) =>
      item.label.includes(search.toLowerCase()),
    );
    return filteredBySearch;
  }, [category, search]);

  const activeCategory = useMemo(() => {
    if (!category || category === "") return CATEGORIES.semua;
    return category;
  }, [category]);

  // Mobile responsive
  const isMdOrMore = useMemo(() => {
    return isMd || isLg || isXl || is2Xl;
  }, [isMd, isLg, isXl, is2Xl]);

  const [isCategoryMenuOpened, setIsCategoryMenuOpened] = useState(false);

  return (
    <DefaultLayout title="Kamus Bisindo - Cakap">
      <div className="flex w-full relative">
        {/* category list */}
        <RenderIf when={!isMdOrMore}>
          <MobileCategories
            categories={CATEGORIES}
            activeCategory={activeCategory}
            isOpened={isCategoryMenuOpened}
            setIsOpened={setIsCategoryMenuOpened}
          />
        </RenderIf>

        <RenderIf when={isMdOrMore}>
          <DesktopCategory
            categories={CATEGORIES}
            activeCategory={activeCategory}
          />
        </RenderIf>

        {/* content */}
        <div className="p-4 md:p-8 md:pt-4 w-full h-screen-no-header flex flex-col">
          <div className="">
            {/* highlight */}
            <div className="md:hidden">
              <Video
                key={playedLabel}
                src={`/dictionary/${playedLabel}.mp4`}
                label={playedLabel}
                labelInside
                autoStart
              />
            </div>

            {/* topbar */}
            <div className="flex justify-end items-center sticky top-8 z-50 mt-4 md:mt-0 drop-shadow-xl space-x-2">
              <RenderIf when={!isMdOrMore}>
                <BubbleButton
                  text={activeCategory}
                  onClick={() => setIsCategoryMenuOpened((current) => !current)}
                />
              </RenderIf>
              <SearchBar search={search} setSearch={setSearch} />
            </div>
          </div>

          {/* video boxes */}
          <RenderIf when={filteredDictItems.length === 0}>
            <div className="text-center mt-4">
              Tidak dapat menemukan
              <div>
                <strong>{search}</strong>
              </div>
            </div>
          </RenderIf>
          <div className="grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4 mt-4 overflow-auto max-h-full">
            {filteredDictItems.map((item) => (
              <div
                key={item.label}
                className="h-fit"
                onClick={() => {
                  setPlayedLabel(item.label);
                }}
              >
                <Video
                  src={`/dictionary/${item.label}.mp4`}
                  label={item.label}
                  onClick={!isMdOrMore && function () {}}
                ></Video>
              </div>
            ))}
          </div>
        </div>

        {/* decoration */}
        <BackgroundDecoration />
      </div>
    </DefaultLayout>
  );
}

export default Dictionary;

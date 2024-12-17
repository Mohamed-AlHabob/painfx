import Search from "@/components/global/search";
import { UserWidget } from "@/components/global/user-widget";

export const Navbar = async () => {
  return (
    <div className="py-2 bg-[#cefcc8] dark:bg-[#1A1A1D] px-3 md:px-7 md:py-5 flex gap-5 justify-between md:justify-end items-center">
      <Search
        searchType="POSTS"
        className="rounded-full !opacity-100 px-3 bg-[#ffffff] dark:bg-themeBlack"
        placeholder="Search..."
      />
      <UserWidget />
    </div>
  );
};

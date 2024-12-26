import GlassSheet from "@/components/global/glass-sheet";
import Search from "@/components/global/search";
import { UserWidget } from "@/components/global/user-widget";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Menu from "../group-navbar";

export const Navbar = async () => {
  return (
    <div className="py-2 bg-[#cefcc8] dark:bg-[#1A1A1D] px-3 md:px-7 md:py-5 flex gap-5 justify-between md:justify-end items-center">
      <div className="md:hidden">
        <GlassSheet
          triggerClass="md:hidden"
          trigger={
            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        >
         <Menu orientation="mobile" />
        </GlassSheet>
      </div>
      <Search
        searchType="POSTS"
        className="rounded-full !opacity-100 px-3 bg-[#ffffff] dark:bg-themeBlack"
        placeholder="Search..."
      />
      <UserWidget />
    </div>
  );
};

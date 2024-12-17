"use client";
import { Button } from "@/components/ui/button";

import { Loader } from "./loader";

import { continueWithGoogle } from "@/lib";
import { Google } from "../icons";

export const GoogleAuthButton = () => {
  const handleClick = () => {
    continueWithGoogle();
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full rounded-2xl flex gap-3"
      variant={"outline"}
    >
      <Loader loading={false}>
        <Google />
        Google
      </Loader>
    </Button>
  );
};

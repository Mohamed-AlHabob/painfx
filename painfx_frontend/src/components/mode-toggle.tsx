"use client"

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ActionTooltip } from "./global/action-tooltip";
import { CONSTANTS } from "@/constants";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="space-y-2 border border-input bg-background shadow-sm max-x-500 rounded-xl flex items-center">
      <div className=" flex justify-between space-x-2">
        {CONSTANTS.modetoggle.map((item) => (
          <ActionTooltip
            key={item.id}
            side="top"
            align="center"
            label={item.label}
          >
            <Button
              variant={"ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(item.label.toLowerCase())}
            >
              {item.icon}
            </Button>
          </ActionTooltip>
        ))}
      </div>
    </div>
  );
}

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logout, Settings } from "@/components/icons";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { DropDown } from "../drop-down";
import { useLogoutMutation, useRetrieveUserQuery } from "@/redux/services/auth/authApiSlice";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import  LanguageSwitcher  from "./Switch-language";
import { cn } from "@/lib/utils";
import PaymentButton from "../payment";
import { logout } from "@/redux/services/auth/authSlice";
import { Skeleton } from "@/components/ui/skeleton";

export const UserDropDown = () => {
  const { data: user, isLoading,isFetching } = useRetrieveUserQuery();
  const router = useRouter();
  const [Blogout] = useLogoutMutation();
  const { t } = useTranslation();

  if (isLoading || isFetching) {
    return (
      <UserDropDown.Skeleton />
    )
  }

  const handleLogout = () => {
    Blogout()
      .unwrap()
      .then(() => {
        logout();
        router.push("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
      
  };

  return (
    <DropDown
      title={t('account')}
      trigger={<Avatar className={cn(
        "h-7 w-7 md:h-10 md:w-10 cursor-pointer bg-[linear-gradient(152deg,_#fff,_#B4F576_42%,_#7EF576)]",
      )}>
        <AvatarImage src={user?.profile?.avatar} />
        <AvatarFallback className={cn("h-7 w-7 md:h-10 md:w-10 cursor-pointer bg-[linear-gradient(152deg,_#fff,_#B4F576_42%,_#7EF576)]")}>
            {user?.first_name?.[0] || "S"}
        </AvatarFallback>
      </Avatar>}
    >
      <div className="bg-background border rounded-lg p-4 space-y-4">
        <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2">
              <Avatar className={cn("h-7 w-7 md:h-10 md:w-10 cursor-pointer bg-[linear-gradient(152deg,_#fff,_#B4F576_42%,_#7EF576)]")}>
                <AvatarImage src={user?.profile?.avatar} />
                <AvatarFallback className={cn("h-7 w-7 md:h-10 md:w-10 cursor-pointer bg-[linear-gradient(152deg,_#fff,_#B4F576_42%,_#7EF576)]")}>
                  {user?.first_name?.[0]}
                </AvatarFallback>
              </Avatar>
                <h2 className="font-semibold">{`${user?.first_name} ${" "} ${user?.last_name}`}</h2>
              </div>
        </div>
        <Separator className="my-2" />
       {user?.role === "doctor"&&"clinic" ? (
          <Link href="/branch/overview/" className="flex gap-x-2 px-2">
            <Settings /> {t('settings')}
          </Link>
        ):
        <Link href={`/proflile/${user?.id}`} className="flex gap-x-2 px-2">
        <Settings /> {t('profile')}
      </Link>
        }
        <Separator className="my-2" />

        <Button
          variant="ghost"
          className="w-full justify-start font-normal"
          onClick={handleLogout}
        >
          <Logout />
          {t('sign_out')}
        </Button>

        <Separator className="my-2" />

        <div className="space-y-4">
          <h3 className="text-sm text-muted-foreground">{t('preferences')}</h3>
          <div className="flex justify-between items-center">
            <p>{t('theme')}</p>
            <ModeToggle />
          </div>
          <LanguageSwitcher />
        </div>
        <Separator className="my-2" />
        <PaymentButton/>
      </div>
    </DropDown>
  );
};


UserDropDown.Skeleton = function UserDropDownSkeleton() {
  return (
    <div className="flex items-center justify-center">
      <Skeleton className={cn("h-10 w-10 rounded-full animate-pulse")} />
    </div>
  )
}

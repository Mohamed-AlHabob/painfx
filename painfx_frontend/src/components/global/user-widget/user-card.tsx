import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CalendarDays, MapPin } from "lucide-react";

type UserCardProps = {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  joined?: string;
  bio?: string;
  topic?: string;
  Optional?: string;
  role?: string;
};

export default function UserCard({
  id,
  name,
  email = "supernova@gmail.com",
  phone_number = "776200953",
  address = "No address provided",
  avatar,
  joined = "2024-12-02",
  bio = "AI researcher specializing",
  role,
}: UserCardProps) {
  return (
    <div className="flex items-center gap-3">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link href={`/X/user/${id}`} aria-label={`View profile of ${name}`} className="cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage alt={name} src={avatar} />
              <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="w-full">
          <div className="flex justify-between space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage alt={name} src={avatar} />
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{name}</h4>
              <p className="text-sm">{bio}</p>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs ">
                  Joined {new Date(joined).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center pt-2">
                <MapPin className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs ">{address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Link className=" hover:text-zinc-300" href={`tel:${phone_number}`}>
                  {phone_number}
                </Link>
                {phone_number && (
               <span className="text-zinc-600">•</span>
              )}
                <Link
                  className=" hover:text-zinc-300 truncate overflow-hidden text-ellipsis whitespace-nowrap"
                  href={`mailto:${email}`}
                >
                  {email}
                </Link>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Link href={`/X/user/${id}`} className="cursor-pointer">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {email}
              </p>
            </div>
          </Link>
          {role && (
            <Badge variant="secondary" className=" hover:bg-zinc-200 dark:hover:bg-zinc-700">
              {role}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

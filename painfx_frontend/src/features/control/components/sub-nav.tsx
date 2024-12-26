"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { title: "Overview", href: "/branch/overview" },
  { title: "Reservations", href: "/branch/reservations" },
  { title: "Doctors", href: "/branch/doctors" },
  { title: "Configure", href: "/branch/configure" },
];

export function SubNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b px-4 overflow-x-auto">
      <div className="flex h-12 items-center gap-4">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";

import { Loader } from "lucide-react";
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";

type Props = {
  className?: string;
};

const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex  h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image alt="Logo" src="/logo_1.png" width={50} height={50} />
          <h1 className="text-2xl font-extrabold text-sky-600 tracking-wide">
            Prolingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="learn" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem
          label="leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem
          label="quests"
          href="/quests"
          iconSrc="/quests.svg"
        />
        <SidebarItem label="shop" href="/shop" iconSrc="/shop.svg" />
        <SidebarItem label="Quiz" href="/quiz" iconSrc="/shop.svg" />
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default Sidebar;

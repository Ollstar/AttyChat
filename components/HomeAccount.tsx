"use client";

import { Fab } from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Account from "./Account";

type Bot = {
  botName: string;
  primer: string;
  botQuestions: string[];
  creatorId: string;
  botColor: string;
  show: boolean;
  avatar: string;
};

type HomeAccountProps = {
  bot: Bot;
}
export default function HomeAccount(bot: HomeAccountProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (

    <div className="fixed h-12 w-12 bottom-2 left-2 z-10">
      <Fab
        className={`fixed  bottom-2 `}
        color="primary"
      >
        <Account />
      </Fab>
    </div>

  );
}

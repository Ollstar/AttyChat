"use client";

import { Fab } from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Account from "./Account";

export default function HomeAccount() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
    {pathname?.includes("chat") ? "" : <div className="fixed bottom-2 left-2">
      <Fab
        className={`fixed bottom-2 left-2 ${pathname?.includes("chat") ? "hidden" : ""}`}
        color="primary"
      >
        <Account />
      </Fab>
    </div>}
    </>
  );
}

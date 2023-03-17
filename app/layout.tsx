import { SessionProvider } from "../components/SessionProvider";
import "../styles/globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Login from "../components/Login";
import ClientProvider from "../components/ClientProvider";
import PersistentDrawerLeft from "../components/SideAndTopBar";
import Account from "../components/Account";
import HomeAccount from "../components/HomeAccount";
import { getSession } from "next-auth/react";
import React from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html>

      <body>
        <div>
          <SessionProvider session={session}>
            <React.Suspense fallback="Loading...">
            {!session ? (
              <Login />
            ) : (
              <div>
                <ClientProvider />
                <PersistentDrawerLeft />
                <div>{children}</div>


              </div>
            )}
            </React.Suspense>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}

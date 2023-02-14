import { SessionProvider } from "../components/SessionProvider";
import SideBar from "../components/SideBar";
import "../styles/globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Login from "../components/Login";
import ClientProvider from "../components/ClientProvider";
import Navbar from "../components/Navbar";
import Drawer from "../components/Drawer";
import { Box } from "@mui/material";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html>
      <head/>

      <body>
        <div style={{display:"flex"}}>
        <SessionProvider session={session}>
          {!session ? (
            <Login />
          ) : (
            <div>
              <Drawer />
              <ClientProvider />
              <div>{children}</div>
            </div>
          )}
        </SessionProvider>
        </div>
      </body>
    </html>
  );
}

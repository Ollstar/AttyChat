import { SessionProvider } from "../components/SessionProvider";
import "../styles/globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Login from "../components/Login";
import ClientProvider from "../components/ClientProvider";
import PersistentDrawerLeft from "../components/SideAndTopBar";


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
              <PersistentDrawerLeft />
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

"use client"
import { useRouter, usePathname } from "next/navigation";

import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import mySwrConfig from "../lib/swr-config";
import useSWR from "swr";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, deleteDoc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import CancelIcon from "@mui/icons-material/Cancel";
import ChatRow from "./ChatRow";

export default function Account() {
  const { data: session } = useSession();
  const [openDialog, setOpenDialog] = useState(false);
    const [showImageSelect, setShowImageSelect] = useState(false);
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );


  const handleAvatarClick = () => {
    setOpenDialog(true);
  };
  const handleImageSelectClick = () => {
    setShowImageSelect(true);
    };

  const handleChatSelect = (chat: string) => {
  };

  const handleDeleteChat = async (chat: string) => {
    await deleteDoc(doc(db, "users", session?.user?.email!, "chats", chat));
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div >

      <Avatar
        src={session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name!}`}
        onClick={handleSignOut}
        sx={{ cursor: "pointer", width: "100%", height: "100%" }}
      />
      {/* <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Chats</DialogTitle>
        <div>
            <div className="flex flex-col space-y-2 my-2 mb-10">
              {loading && (
                <div className="animate-pulse text-center text-white"></div>
              )}


              {chats?.docs.map((chat) => (
                <ChatRow key={chat.id} id={chat.id} />
              ))}
            </div>
          </div>


      </Dialog> */}
    </div>
  );
}

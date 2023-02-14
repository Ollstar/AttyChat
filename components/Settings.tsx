"use client";
import React, { FormEvent, useState } from "react";
import {
  Dialog,
  Box,
  ListSubheader,
  TextField,
  Toolbar,
  Button,
  IconButton,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import {
  addDoc,
  doc,
  collection,
  serverTimestamp,
  setDoc,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useDocument } from "react-firebase-hooks/firestore";

export const Settings = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session } = useSession();
  // load the document containing meta about the project
  // load the document containing meta about the project
  const [primer,loading,error] = useDocument(session &&
    doc(db, "users", session?.user?.email!, "primer", session?.user?.email!)
  );

  const [prependageMessage, setPrependageMessage] =  useState(
    session &&
    primer?.data()?.text ? primer?.data()?.text : "Default"
  );
  const data = {
    text: prependageMessage,
    createdAt: serverTimestamp(),
    user: {
      _id: session?.user?.email!,
      name: session?.user?.name!,
    },
  };
  const handleModalClose = async (e: FormEvent, buttonState: string) => {
    if (buttonState === "Save") {
      await setDoc(
        doc(
          db,
          "users",
          session?.user?.email!,
          "primer",
          session?.user?.email!
        ),
        data
      );

      console.log("Prep" + prependageMessage);
    }
    setModalOpen(false);
  };

  return (
    <>
      <Box>
        <IconButton onClick={() => setModalOpen(true)}>
          <PsychologyIcon />
        </IconButton>
      </Box>
      <Dialog
        fullWidth
        open={modalOpen}
        scroll="paper"
        onClose={(e: FormEvent) => handleModalClose(e, "Cancel")}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{}} bgcolor="background.paper">
          <Box padding={2}>
            <ListSubheader
              sx={{ fontFamily: "poppins" }}
              component="div"
              id="modal-header"
            >
              Training Message
            </ListSubheader>
            <form onSubmit={(e: FormEvent) => handleModalClose(e, "Save")}>
              <TextField
                id="filled-multiline-static"
                fullWidth
                multiline
                rows={10}
                InputProps={{ style: { fontFamily: "poppins" } }}
                variant="outlined"
                value={prependageMessage}
                onChange={(e) => setPrependageMessage(e.target.value)}
                InputLabelProps={{ style: { fontFamily: "poppins" } }}
              />
            </form>
          </Box>
        </Box>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Button
            sx={{ fontFamily: "poppins" }}
            variant="outlined"
            onClick={(e: FormEvent) => handleModalClose(e, "Save")}
          >
            Save
          </Button>
          <Button
            sx={{ fontFamily: "poppins" }}
            onClick={(e: FormEvent) => handleModalClose(e, "Cancel")}
          >
            Cancel
          </Button>
        </Toolbar>
      </Dialog>
    </>
  );
};

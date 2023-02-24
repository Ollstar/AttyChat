"use client";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TwitterPicker } from "react-color";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import SettingsIcon from "@mui/icons-material/Settings";
type Bot = {
  botName: string;
  primer: string;
  botQuestions: string[];
  creatorId: string;
  botColor: string;
};

type Props = {
  bot?: Bot;
  botid?: string;
};

function NewBot({ bot, botid }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [botName, setBotName] = useState(bot?.botName ?? "");
  const [primer, setPrimer] = useState(bot?.primer ?? "");
  //useRef for botColor
  const botColor = useRef(bot?.botColor ?? "#000000");
  const [botQuestions, setBotQuestions] = useState<string[]>(
    bot?.botQuestions ?? [""]
  );
  useEffect(() => {
    router.refresh();
  }, [botQuestions]);

  const createNewBot = async () => {
    const docRef = await addDoc(collection(db, "bots"), {
      creatorId: session?.user?.email!,
      createdAt: serverTimestamp(),
      botName,
      primer,
      botQuestions,
      botColor: botColor.current,
    });

    router.push(`/bot/${docRef.id}`);
  };

  const editBot = async () => {
    if (!botid) return;

    await updateDoc(doc(db, "bots", botid), {
      botName,
      primer,
      botQuestions,
      botColor: botColor.current,
    });
    toast.success("Bot edited!", {
      duration: 2000,
      position: "top-center",
      style: {
        border: "1px solid white",
        padding: "16px",
      },
    }),
      router.replace(`/bot/${botid}`);
  };

  const deleteBot = async () => {
    if (!botid) return;
    // ask the user if they are sure to delete if no return
    const isSure = confirm("Are you sure you want to delete this bot?");
    if (!isSure) return;

    await deleteDoc(doc(db, "bots", botid));
    toast.success("Bot deleted!", {
      duration: 2000,
      position: "top-center",
      style: {
        border: "1px solid white",
        padding: "16px",
      },
    }),
      router.replace("/");
  };

  const addQuestionField = () => {
    setBotQuestions((prevQuestions) => [...prevQuestions, ""]);
  };

  const removeQuestionField = (index: number) => {
    setBotQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions.splice(index, 1);
      return newQuestions;
    });
  };

  const updateQuestionField = (index: number, value: string) => {
    setBotQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = value;
      return newQuestions;
    });
  };

  const handleColorChange = (color: any) => {
    botColor.current = color.hex;
  };

  const handleOpen = () => setShowModal(true);

  const handleClose = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (bot) {
      editBot();
      router.refresh();
    } else {
      createNewBot();
    }

    handleClose();
  };

  return (
    <>
      <Box fontFamily="poppins" fontSize="lg" color="black">
        <div
          onClick={handleOpen}
          className={`chatRow text-white p-2 ml-2 text-center ${
            !bot ? "border border-black" : ""
          } `}
        >
          {bot ? <SettingsIcon /> : <h2 className="text-black ">New Bot</h2>}
        </div>
      </Box>

      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        sx={{
          "& .MuiDialog-paper": {
            fontFamily: "poppins",
            width: "100%",
            maxWidth: "600px",
          },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <DialogTitle id="modal-title" sx={{ fontFamily: "poppins" }}>
            {bot ? "Edit Bot" : "New Bot"}
          </DialogTitle>
          {bot && bot.creatorId === session?.user?.email && (
            <Button
              onClick={deleteBot}
              sx={{ fontFamily: "poppins", color: "red" }}
            >
              Delete
            </Button>
          )}
        </Toolbar>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Bot Name"
                variant="outlined"
                InputProps={{ sx: { fontFamily: "poppins" } }}
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                  sx: { fontFamily: "poppins" },
                }}
                required
              />
              <TextField
                fullWidth
                label="Primer"
                variant="outlined"
                value={primer}
                onChange={(e) => setPrimer(e.target.value)}
                multiline
                rows={10}
                InputLabelProps={{
                  shrink: true,
                  sx: { fontFamily: "poppins" },
                }}
                InputProps={{ sx: { fontFamily: "poppins" } }}
                required
              />
              <Box sx={{ mt: 2, mb: 2, fontFamily: "poppins" }} component="div">
                Color Picker
              </Box>
              <TwitterPicker
                color={botColor.current}
                onChange={handleColorChange}
                onChangeComplete={handleColorChange}
                className="mb-2"
              />
              <Box sx={{ mt: 2, mb: 2, fontFamily: "poppins" }} component="div">
                Quick Questions
              </Box>
              {botQuestions.map((question, index) => (
                <Box key={index} sx={{ display: "flex", mb: 2 }}>
                  <TextField
                    key={index}
                    fullWidth
                    label={`Question ${index + 1}`}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                      sx: { fontFamily: "poppins" },
                    }}
                    InputProps={{ sx: { fontFamily: "poppins" } }}
                    value={question}
                    onChange={(e) => updateQuestionField(index, e.target.value)}
                    sx={{ mr: 2 }}
                    required
                  />
                  <Button
                    variant="outlined"
                    onClick={() => removeQuestionField(index)}
                    sx={{ fontFamily: "poppins" }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={addQuestionField}
                sx={{ fontFamily: "poppins" }}
              >
                Add Question
              </Button>
              <Toolbar sx={{ justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{ fontFamily: "poppins" }}
                >
                  {bot ? "Save Changes" : "Create"}
                </Button>
                <Button onClick={handleClose} sx={{ fontFamily: "poppins" }}>
                  Cancel
                </Button>
              </Toolbar>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewBot;

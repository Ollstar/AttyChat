"use client";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BlockPicker, TwitterPicker } from "react-color";
import ClearIcon from "@mui/icons-material/Clear";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

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
  InputAdornment,
  IconButton,
  List,
  ListItem,
  Paper,
  Avatar,
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
import { MoreVert } from "@mui/icons-material";
type Bot = {
  botName: string;
  primer: string;
  botQuestions: string[];
  creatorId: string;
  botColor: string;
  show: boolean;
  avatar: string;
  textColor: string;
};

type Props = {
  bot?: Bot;
  botid?: string;
  autoOpen?: boolean;
  onClose?: () => void;
};

function NewBot({ bot, botid, autoOpen = false, onClose }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(autoOpen || false);
  const [botName, setBotName] = useState(bot?.botName ?? "");
  const [primer, setPrimer] = useState(bot?.primer ?? "");
  const [textColor, setTextColor] = useState(bot?.textColor ?? "#FFFFFF");
  const [show, setShow] = useState(bot?.show ?? true);
  const [isBlack, setIsBlack] = useState(false);
  //useRef for botColor
  const [botColor, setBotColor] = useState(bot?.botColor ?? "#397EF7");
  const [botQuestions, setBotQuestions] = useState<string[]>(
    bot?.botQuestions ?? [""]
  );
  const [avatar, setAvatar] = useState(bot?.avatar ?? "");

  const createNewBot = async () => {
    const docRef = await addDoc(collection(db, "bots"), {
      creatorId: session?.user?.email!,
      createdAt: serverTimestamp(),
      botName,
      primer,
      show,
      botQuestions,
      avatar,
      botColor: botColor,
      textColor: textColor,
    });

    router.push(`/bot/${docRef.id}`);
  };

  const editBot = async () => {
    if (!botid) return;
    console.log("bot textcolor : ", textColor);

    await updateDoc(doc(db, "bots", botid), {
      botName,
      primer,
      botQuestions,
      show,
      botColor,
      avatar,
      textColor,
    }).then(() => {
      toast.success("Bot edited!", {
        duration: 2000,
        position: "top-center",
        style: {
          padding: "16px",
        },
      });
    });
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

  const updateAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
  };

  const handleOpen = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (bot) {
      editBot();
    } else {
      createNewBot();
    }

    handleClose();
  };

  return (
    <>
      {autoOpen ? (
        ""
      ) : (
        <Box fontFamily="poppins" fontSize="lg" color="black">
          <div
            onClick={handleOpen}
            
          >
            {bot ? (
              <MoreHorizIcon sx={{ color: "black" }} />
            ) : (
              <h2 className="text-black ">New Bot</h2>
            )}
          </div>
        </Box>
      )}

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
        <form onSubmit={handleSubmit}>
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

          <Box sx={{ mb: 2, mt: 2 }}>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
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
                <Box sx={{ mt: 2, fontFamily: "poppins" }} component="div">
                  Bot Colors
                </Box>
                <BlockPicker
                  styles={{
                    default: {
                      card: {
                        boxShadow: "none",

                      },
                      head: {
                        display: "none",
                      },

                      body: {
                        // make the items in the middle from both axis
                        backgroundColor: botColor,
                        borderTopRightRadius: "6px",
                        borderTopLeftRadius: "6px",
                        borderBottomWidth: "0px",
                        boxShadow: "none",

                      },

                      label: {
                        color: "white",
                      },
                      // set the background of the other classes in BlockPickerDefaultyStyles each to a different color
                      input: {
                        display: "none",
                      },
                    },
                  }}
                  colors={[
                    // Make the defaults black white gray and yellow red and blue and green
                    "#000000",
                    "#FFFFFF",
                    "#808080",
                    "#FFFF00",
                    "#FF0000",
                    "#0000FF",
                    "#397EF7",
                  ]}
                  triangle="hide"
                  width="100%"
                  color={textColor}
                  onChange={(color) => setTextColor(color.hex)}
                  className=" font-[poppins]"
                />

                <BlockPicker
                  styles={{
                    default: {
                      head: {
                        borderTopRightRadius: "0px",
                        borderTopLeftRadius: "0px",
                        height: "50px",
                      },
                      card: {},
                      body: {
                      },
                      label: {
                        color: textColor,
                        bottom: "40%",
                      },
                    },
                  }}
                  colors={[
                    "#FF6900",
                    "#FCB900",
                    "#7BDCB5",
                    "#00D084",
                    "#8ED1FC",
                    "#0693E3",
                    "#ABB8C3",
                    "#EB144C",
                    "#F78DA7",
                    "#9900EF",
                  ]}
                  triangle="hide"
                  width="100%"
                  color={botColor}
                  onChange={(color) => setBotColor(color.hex)}
                  className="mb-2 shadow-2xl font-[poppins] text-white"
                />
                <Box sx={{ fontFamily: "poppins" }} component="sub">
                  Text
                </Box>

                <Box
                  sx={{ mt: 2, mb: 2, fontFamily: "poppins" }}
                  component="div"
                >
                  Avatar
                </Box>
                <Box>
                  <Box
                    alignItems="center"
                    borderRadius="6px"
                    className=" shadow-sm"
                  >
                    {avatar !== "" && (
                      <Box display="flex" justifyContent="center">
                        {avatar ? (
                          <Avatar
                            src={avatar}
                            sx={{ width: "100px", height: "100px" }}
                          />
                        ) : (
                          <Avatar sx={{ width: "100px", height: "100px" }} />
                        )}
                      </Box>
                    )}
                    <TextField
                      fullWidth
                      type="file"
                      // make the props font poppins
                      InputProps={{ sx: { fontFamily: "poppins" } }}
                      onChange={updateAvatar}
                      className="mb-2"
                    />
                  </Box>
                </Box>

                <Box
                  sx={{ mt: 2, mb: 2, fontFamily: "poppins" }}
                  component="div"
                >
                  Quick Questions
                </Box>
                {botQuestions.map((question, index) => (
                  <TextField
                    key={index}
                    multiline
                    fullWidth
                    label={`Question ${index + 1}`}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                      sx: { fontFamily: "poppins" },
                    }}
                    InputProps={{
                      sx: { mb: "1rem" },

                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => removeQuestionField(index)}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={question}
                    onChange={(e) => updateQuestionField(index, e.target.value)}
                    sx={{ mr: 2 }}
                    required
                  />
                ))}
                <Button
                  variant="outlined"
                  onClick={addQuestionField}
                  sx={{ fontFamily: "poppins" }}
                >
                  Add Question
                </Button>
              </Box>
            </DialogContent>
          </Box>
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
      </Dialog>
    </>
  );
}

export default NewBot;

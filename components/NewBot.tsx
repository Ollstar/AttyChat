"use client";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function NewBot() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [botName, setBotName] = useState("");
  const [primer, setPrimer] = useState("");
  const [botQuestions, setBotQuestions] = useState<string[]>([""]);

  const createNewBot = async () => {
    const docRef = await addDoc(collection(db, "bots"), {
      creatorId: session?.user?.email!,
      createdAt: serverTimestamp(),
      botName,
      primer,
      botQuestions,
    });

    router.push(`/bot/${docRef.id}`);
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

  const handleOpen = () => setShowModal(true);

  const handleClose = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNewBot();
    handleClose();
  };

  return (
    <>
      <div onClick={handleOpen} className="chatRow p-2 border border-gray-700">
        <PlusIcon className="h-4 w-4" />
        <h2>New Bot</h2>
      </div>

      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        sx={{ "& .MuiDialog-paper": { fontFamily:"poppins", width: "100%", maxWidth: "600px" } }}
      >
        <DialogTitle id="modal-title" >New Bot</DialogTitle>
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
                InputLabelProps={{ shrink: true, sx: { fontFamily: "poppins" } }}
                required
              />
              <TextField
                fullWidth
                label="Primer"
                variant="outlined"
                value={primer}
                onChange={(e) => setPrimer(e.target.value)}
                multiline
                rows={4}
                InputLabelProps={{ shrink: true, sx: { fontFamily: "poppins" } }}
                InputProps={{ sx: { fontFamily: "poppins" } }}
                required
              />
              <ListSubheader
                sx={{ mt: 2, mb: 1, fontFamily: "poppins" }}
                component="div"
              >
                Quick Questions
              </ListSubheader>
              {botQuestions.map((question, index) => (
                <Box key={index} sx={{ display: "flex", mb: 2 }}>
                  <TextField
                    key={index}
                    fullWidth
                    label={`Question ${index + 1}`}
                    variant="outlined"
                    InputLabelProps={{ shrink: true, sx: { fontFamily: "poppins" } }}
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
                <Button type="submit" variant="outlined" sx={{ fontFamily: "poppins" }}>
                  Create
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

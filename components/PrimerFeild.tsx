import { FormEvent, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ListSubheader,
  Toolbar,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import mySwrConfig from "../lib/swr-config";

const fetchPrimer = (session: any) =>
  fetch("/api/getPrimer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: { user: { email: session?.user?.email! } },
    }),
  }).then((res) => res.json());

function PrimerField() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { data: primer, mutate: setPrimer } = useSWR(
    "primer",
    session ? () => fetchPrimer(session) : null,
    {
      ...mySwrConfig,
      revalidateOnMount: true,
    }
  );
  const [text, setText] = useState(primer?.text || "");

  const handleOpen = async () => {
    setIsOpen(true);
    const data = await fetchPrimer(session);
    setText(data.text);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/setPrimer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: { user: { email: session?.user?.email! } },
        text,
      }),
    });
    const data = await response.json();
    setPrimer(data.text);
    setText(data.text);
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <IconButton color="primary" onClick={handleOpen}>
        <PsychologyIcon />
      </IconButton>
      <Dialog
        fullWidth
        open={isOpen}
        scroll="paper"
        onClose={handleClose}
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
            <form onSubmit={handleSubmit}>
              <TextField
                id="filled-multiline-static"
                fullWidth
                multiline
                rows={10}
                InputProps={{ style: { fontFamily: "poppins" } }}
                variant="outlined"
                value={text}
                onChange={handleChange}
                InputLabelProps={{ style: { fontFamily: "poppins" } }}
              />
                  <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Button
          type="submit"
            sx={{ fontFamily: "poppins" }}
            variant="outlined"
          >
            Save
          </Button>
          <Button
            sx={{ fontFamily: "poppins" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Toolbar>
            </form>
          </Box>
        </Box>
    
      </Dialog>
    </>
  );
}

export default PrimerField;

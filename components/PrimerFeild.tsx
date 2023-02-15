import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Toolbar,
} from '@mui/material';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import mySwrConfig from '../lib/swr-config'

const fetchPrimer = (session: any) => 
  fetch('/api/getPrimer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session: { user: { email: session?.user?.email! } } }),
  }).then((res) => res.json());

function PrimerField() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { data: primer, mutate: setPrimer } = useSWR("primer", session ? () => fetchPrimer(session) : null, {
    ...mySwrConfig,
    revalidateOnMount: true,
  });
  const [text, setText] = useState(primer?.text || '');

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
    const response = await fetch('/api/setPrimer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Set Primer
      </Button>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Set Primer</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <form onSubmit={handleSubmit}>
              <TextField
                label="Primer"
                value={text}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Toolbar>
                <Box display="flex" justifyContent="flex-end" width="100%">
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit" color="primary" variant="contained">
                    Save
                  </Button>
                </Box>
              </Toolbar>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PrimerField;

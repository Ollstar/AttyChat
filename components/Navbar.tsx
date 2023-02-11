"use client"
import {AppBar, Toolbar, IconButton, Typography, Button} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import NewChatWithQuestion from "./NewChatWithQuestion";

function Navbar() {
  return (
    <>
    <AppBar position="static">
        <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" >
                News
            </Typography>

        </Toolbar>
    </AppBar>
    </>
    )
}

export default Navbar
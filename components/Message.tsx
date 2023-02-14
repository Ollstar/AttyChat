"use client"
import { Box, Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { useSession } from "next-auth/react";

type Props = {
  message: DocumentData;
};

function Message({ message }: Props) {
  const { data: session } = useSession();

  const isUser= message.user.name === session?.user?.name;
  
  return (
    <Box sx={{display: "flex",
    justifyContent: isUser ? "flex-end":"flex-start"}}>
    <Box sx={{backgroundColor:"green"}}>
    <Box 
    sx={{display:"inline-block",width: "70%", padding:"10px", borderRadius: "5px",
     backgroundColor: isUser ? "#e5ded8" : "red", 
       textAlign: isUser ? "right" : "left",float: isUser ? "right" : "left" }}
    >
      <Typography fontFamily= 'Poppins'
 variant="body1" component="p">
        {message.text}
      </Typography>
      <Typography fontFamily= 'Poppins' variant="caption">
        {message.user.name}
      </Typography>
    </Box>
    </Box>
    </Box>
  );
 }
export default Message;
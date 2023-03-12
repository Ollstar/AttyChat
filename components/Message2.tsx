import { Box, Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { useSession } from "next-auth/react";

type Props = {
  message: DocumentData;
};

function Message2({ message }: Props) {
  const { data: session } = useSession();

  const isUser = message.user.name === session?.user?.name;
  // for any message that is not user check if the user name is a bot name and if so get the bot

  

  return (
    <>
      <Box
        sx={{
          display: "inline-block",
          maxWidth: "70%",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: isUser ? "#E9E9EB" : "#397EF7",
          textAlign: isUser ? "right" : "left",
          float: isUser ? "right" : "left",
          color: isUser ? "black" : "white",
        }}
      >
        <Typography
          width="100%"
          fontFamily="Poppins"
          variant="body1"
          sx={{
            fontSize: {
              lg: 18,
              md: 18,
              sm: 16,
              xs: 16,
            },
            wordWrap: "break-word",
          }}
        >
          {message.text}
        </Typography>
        <Box>
          <Typography
            fontFamily="Poppins"
            variant="caption"
            sx={{
              fontSize: {
                lg: 12,
                md: 12,
                sm: 10,
                xs: 10,
              },
              lineHeight: 0.5,
            }}

          >
            {message.user.name}{" "}
          </Typography>
          <Typography
            fontFamily="Poppins"
            variant="caption"
            sx={{
              fontSize: {
                lg: 12,
                md: 12,
                sm: 10,
                xs: 10,
              },
            }}
          >
            {message.createdAt &&
              new Date(message.createdAt.toDate()).toLocaleTimeString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default Message2;

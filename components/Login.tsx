"use client"
import { signIn } from "next-auth/react";
import Image from "next/image"
import Box from "@mui/material/Box";

function Login() {
  return (
    <div className="bg-[#397EF7] flex flex-col text-white font-bold text-3xl h-screen w-screen 
    items-center justify-center text-center">
      <Box display={"flex"} flexDirection="column" fontFamily="Poppins">
        Atty Chat
      <button onClick={() => signIn("google")} className=" 
      animate-pulse">
        Sign In with Google
      </button>
      </Box>

    </div>
  )
}

export default Login

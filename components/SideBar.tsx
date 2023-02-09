'use client'
import { collection } from 'firebase/firestore';
import { useSession, signOut } from 'next-auth/react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import '../styles/globals.css'
import ChatRow from './ChatRow';
import NewChat from './NewChat'

function SideBar() {

  const { data: session } = useSession();
  
  //get 
  const [chats, loading, error] = useCollection(
    session && collection(db, 'users', session.user?.email!, 'chats')
  );

  return (
    <div className='p-2 flex flex-col h-screen'>

        <div className='flex-1'>

            {/* NewChat */}
            <NewChat />

            <div>
                {/* ModalSelection */}
            </div>  

            <div>
                {/* Map through there ChatRows */}
            {chats?.docs.map(chat => (
              <ChatRow key={chat.id} id={chat.id}/>
            ))}

            </div>

        </div>       
        {session && (
          < img 
              onClick={() => signOut()}
              src={session.user?.image!} alt="profile picture" 
              className='h-12 w-12 rounded-full cursor-pointer ml-2 mx-auto mb-2 hover:opacity-50'
          
          />
        )}
    </div>
  )
}

export default SideBar
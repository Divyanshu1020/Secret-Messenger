"use client"
import { User } from 'next-auth'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { GiBatMask } from "react-icons/gi";

export default function Navbar() {
    const {data: session} = useSession()
    const user: User = session?.user as User
  return (
    <nav className=' p-4 md:p-6 shadow-md'>
      <div className=' container mx-auto flex flex-row justify-between items-center'>
        <a href="#" className=' text-xl font-bold flex flex-row '> <div><GiBatMask className=' mr-2' size={25} /></div> <p>No Mask</p></a>
        {
          session ? (
            <>
              <span> Welcome</span>
              <Button 
                className=' w-full md:w-auto'
                onClick={() => signOut()}
              >Logout</Button>
            </>
          ):(
            <>
              <Link href="sign-in">
                <Button>Sign In</Button>
              </Link>
            </>
          )
        }
      </div>
    </nav>
  )
}

'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

export default function page() {
  return (
    <div className=" my-8 mx-4 md:mx-8 lg:mx-auto p-6  rounded w-full max-w-6xl">
      <h1 className=" text-center text-4xl font-bold mb-4"> Public Profile Link</h1>
      <div className=" mb-4">
        <h2 className=" text-lg font-semibold mb-2">http://localhost:3000/{}</h2>
        <div className=" flex items-center flex-col p-2 w-full">
          <Input
            type="text"
            className=" input input-bordered min-w-full min-h-20 max-w-lg"
          />
          <Button>Copy</Button>
        </div>
      </div>

    </div>
  )
}

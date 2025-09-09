
"use client"

import {signIn} from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import React from 'react'
import { getSession } from 'next-auth/react'
import { NextResponse } from 'next/server'

const Page = () => {

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const router = useRouter()

const handleLogin = async (e)=>{
    e.preventDefault()

    const res = await signIn('credentials',{
        email,
        password,
        redirect:false
    })
    if (res.error){
        setError(res.error)

    }else{
        const session = await getSession()
        if(!session){
          return NextResponse.json({
            mesage:"Failed to get Session"
          })
        }
        if(session.user.role === "admin"){
          router.push('/admin')
        }
        else if(session.user.role === "hr"){
          router.push('/hr')
        }
        else if(session.user.role === "employee"){
          router.push('/employee')
        }
        else{
          router.push('/')
        }

    }

}


  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign in Here</h2>
      <form onSubmit={handleLogin}  className="space-y-4">
        <input
          type="text"
          placeholder="Email"
          className="w-full border px-3 py-2"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>

  )
}

export default Page




// https://new-folder-kpaf.vercel.app/
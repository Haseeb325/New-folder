
import { NextResponse } from "next/server";

export async function POST(req) {

    const body = await req.json()
    const {email , password} = body

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    try {

        if(!ADMIN_EMAIL || !ADMIN_PASSWORD){
            return NextResponse.json({
                success:false,
                message:"Credentials not set"
            },{status:400})

        }
        if(email !=ADMIN_EMAIL || password !=ADMIN_PASSWORD){
            return NextResponse.json({
                success:false,
                message:"Please enter correct credentials"
            },{status:401})
        }

        return NextResponse.json({
            status:true,
            message:"Admin Login Successfully"
        })

        
    } catch (error) {
        
        console.log("Error in login")
        return NextResponse.json(
            {

                success:false,
                message:"Login Failed"
                
            },{status:500}
        )

    }
    
    
}
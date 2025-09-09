import dbConnect from "../../../lib/dbConnect";
import Hr from "../../../models/Users";
import { NextResponse } from "next/server";

export async function POST(req){

    await dbConnect()

    try {
        const {token , username, password} = await req.json()

        if(!token || !username || !password){
            return NextResponse.json({
                status:false,
                message:"All Fields are required"
            })
        }

        const hr = await Hr.findOne({verificationToken:token})
        if(!hr){
             return NextResponse.json({
                status:false,
                message:"Invalid or expired token"
            })
        }

        if(hr.isVerified){
             return NextResponse.json({
                status:false,
                message:"Hr is already verified"
            })
        }
        if(hr.tokenExpiry < new Date()){
             return NextResponse.json({
                status:false,
                message:"Token has expired"
            })
        }

        // update the Hr
        hr.username = username
        hr.password = password 
        hr.isVerified = true
        hr.verificationToken = undefined
        hr.tokenExpiry = undefined
        await hr.save()
         return NextResponse.json({
                status:true,
                message:"Hr verified successfully"
            })

        
    } catch (error) {
        
         return NextResponse.json({
                status:false,
                message:"Error in verifying HR"
            })


    }


}
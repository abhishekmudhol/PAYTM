"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import client from "@repo/db/client"


export async function createOnRampTransaction(provider : string , amount : number){
    const session = await getServerSession(authOptions)

    if (!session?.user || ! session.user?.id) {
        return {
            message : `Unauthenticated request`
        }
    }

    const token = (Math.random()*1000).toString()

    await client.onRampTransaction.create({
        data : {
            provider,
            amount: amount * 100,
            startTime : new Date(),
            status : "Processing",
            token,
            userId: Number(session?.user?.id)
        }
    })

    return {
        message: "Done"
    }
} 
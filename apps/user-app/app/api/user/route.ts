import { NextResponse } from "next/server"
import client from "@repo/db/client";

export const GET = async () => {
    const user = await client.user.create({
        data: {
            email: "adfdfgfsd",
            name: "adsads"
        }
    })
    return NextResponse.json({
        message: user
    })
}
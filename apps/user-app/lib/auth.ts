import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import client from "@repo/db/client";

export const authOptions = {
    providers : [
        CredentialsProvider({
            name : "Credentials",
            credentials : {
                phone: { label: "phone",  placeholder: "Phone Number" },
                password: { label: "Password",  placeholder: "Password"},
                email: { label: "email", placeholder: "email"},
                name: { label: "name" , placeholder: "name"},
            },
            async authorize(credentials :any, req) {
                //todo => Do zod validation, OTP validation here
                try {
                    const existingUser = await client.user.findFirst({
                        where : {
                            number : credentials.phone
                        }
                    })

                    if (!existingUser) {

                        const hashPassword = await bcrypt.hash(credentials.password , 14)

                        try {
                            const user = await client.user.create({
                                data: {
                                    email : credentials.email,
                                    name : credentials.name ,
                                    number: credentials.phone,
                                    password: hashPassword
                                }
                            });
                        
                            return {
                                id: user.id.toString(),
                                name: user.name,
                                email: user.number
                            }
                        } catch(error : any) {
                            console.log(`error from /lib/auth.ts ${error.message}`);
                            return null
                        }
                    }

                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);

                    if (!passwordValidation) {
                        throw new Error('Invalid credentials. Please try again.');
                    }

                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number
                    }
                } catch (error:any) {
                    console.log(`error from /lib/auth.ts ${error}`);
                    return null
                }
            },
        })
    ],
    secret: process.env.JWT_SECRET || "secret@25",
    callbacks : {
        async session({ session ,token } : any) {
            session.user.id = token.sub
            return session
        },
    },
} satisfies NextAuthOptions
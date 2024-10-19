"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import client from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions)
    const from = session?.user?.id

    if (!from) {
        return {
            message: `Error: No sender specified, session expires`
        }
    }

    const toUser = await client.user.findFirst({
        where: {
            number: to
        }
    })

    if (!toUser) {
        return {
            message: `Error: Recipient not found.`
        }
    }

    try {
        await client.$transaction(async (tx) => {
            // Fetch sender's balance within the transaction
            const fromBalance = await tx.balance.findUnique({
                where: {
                    userId: Number(from)
                }
            })

            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error('Insufficient funds');
            }

            // Decrement the sender's balance
            await tx.balance.update({
                where: {
                    userId: Number(from)
                },
                data: {
                    amount: { decrement: amount }
                }
            });

            // Increment the recipient's balance
            await tx.balance.update({
                where: {
                    userId: toUser.id
                },
                data: {
                    amount: { increment: amount }
                }
            });
        })

        return {
            message: `Transfer successful`
        }
    } catch (error) {
        console.log(`Error during p2p transfer: ${error}`);
        return {
            message: `Error: Transfer failed`
        }
    }
}

import client from '@repo/db/client'
import express, { Request, Response } from 'express'
const PORT = process.env.PORT || 3003
const app = express()
app.use(express.json())

app.post('/hdfcWebhook' , async (req: Request , res: Response)=>{
    //TODO: Add zod validation here
    //TODO: check of req is actually came from hdfc server , use webhook secret here

    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };
    // Update balance in db, add txn
    try {
        const result = await client.$transaction(async(txn)=>{

            const existingBalanceEntryInDb = await txn.balance.findUnique({
                where: {
                    userId: Number(paymentInformation.userId)
                }
            });

            if (!existingBalanceEntryInDb) {
                await txn.balance.create({
                    data : {
                        userId: Number(paymentInformation.userId),
                        amount: Number(paymentInformation.amount)*100,
                        locked : 0
                    }
                })

                return res.status(200).json({
                    message : `Captured`
                })
            }

            const balance = await txn.balance.update({
                where : {
                    userId : Number(paymentInformation.userId)
                },
                data : {
                    amount : {
                        increment : Number(paymentInformation.amount)*100
                    }
                }
            })

            const newTransaction = await txn.onRampTransaction.update({
                where : {
                    token : paymentInformation.token
                },
                data : {
                    status : "Success",
                }
            })

            res.status(200).json({
                message : `Captured`
            })
            
            return {balance , newTransaction}
        })

        //todo (anather approach)=>
        /*
        try {
            await db.$transaction([
                db.balance.updateMany({
                    where: {
                        userId: Number(paymentInformation.userId)
                    },
                    data: {
                        amount: {
                            // You can also get this from your DB
                            increment: Number(paymentInformation.amount)
                        }
                    }
                }),
                db.onRampTransaction.updateMany({
                    where: {
                        token: paymentInformation.token
                    }, 
                    data: {
                        status: "Success",
                    }
                })
            ]);

            res.json({
                message: "Captured"
            })
        */
    } catch (error) {
        console.log(`error from webhook transaction ${error}`);
        res.status(500).json({
            message: `Error while processing webhook`
        })
    }
})

app.listen(PORT , ()=>{
    console.log(`webhook server is running on port ${PORT}`);
});
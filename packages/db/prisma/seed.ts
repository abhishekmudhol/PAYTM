import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { number: '9999999999' },
    update: {},
    create: {
      number: '9999999999',
      email : "a@gmail.com",
      password: '$2b$14$gKQ86G1fWRSt6AqnGkmCJuafYLtYIhPlrd8QBtoUA6lwZyzZ2kxfu',
      name: 'alice',
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { number: '9999999998' },
    update: {},
    create: {
      number: '9999999998',
      email : "b@gmail.com",
      password: 'bob',
      name: 'bob',
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
    },
  })

  const a = await prisma.user.upsert({
    where: { number: '9371693228' },
    update: {},
    create: {
      number: '9371693228',
      email : "aa@gmail.com",
      password: '$2b$14$gKQ86G1fWRSt6AqnGkmCJuafYLtYIhPlrd8QBtoUA6lwZyzZ2kxfu',
      name: 'aa',
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 2000,
          token: "124",
          provider: "HDFC Bank",
        },
      },
    },
  })

  console.log({ a ,alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
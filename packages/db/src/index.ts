import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export default client; // or export { client } if using named exports

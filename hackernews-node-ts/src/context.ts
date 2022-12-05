import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export type GraphQLContext = {
    prisma: PrismaClient,
    req: string
}

export async function createContext(): Promise<GraphQLContext> {
 return {prisma, req: "hello"}
}
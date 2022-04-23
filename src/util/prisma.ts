import Prisma from "@prisma/client"
import environment from "./config"

const prisma = new Prisma.PrismaClient({ datasources: { db: { url: environment.database.url } } })
export default prisma

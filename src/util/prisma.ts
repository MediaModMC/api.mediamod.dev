import { PrismaClient } from "@prisma/client"
import environment from "./config"

const prisma = new PrismaClient({ datasources: { db: { url: environment.database.url } } })
export default prisma

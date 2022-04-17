import Fastify, { FastifyInstance } from "fastify"
import { buildAPIRoutes } from "./routes/routes"
import environment from "./util/config"
import database from "./database"
import ratelimit from "fastify-rate-limit"

const server: FastifyInstance = Fastify({ logger: true })
server.register(ratelimit, {
    global: false,
    errorResponseBuilder: () => ({ ok: false, message: "Please try again later!" })
})
server.register(buildAPIRoutes)
server.listen(environment.port, "0.0.0.0", async (err) => {
    await database.connect()

    if (err) {
        console.error(err)
        process.exit(0)
    }
})

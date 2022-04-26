import Fastify, { FastifyInstance } from "fastify"
import logger from "../util/logger"
import environment from "../util/config"
import ratelimit from "fastify-rate-limit"

import { buildAPIRoutes } from "./routes"

const server: FastifyInstance = Fastify({ logger })
server.register(ratelimit, {
    global: false,
    errorResponseBuilder: () => ({ ok: false, message: "Please try again later!" })
})
server.register(buildAPIRoutes)
server.listen(environment.port ?? 3000, "0.0.0.0", async (err) => {
    if (err) {
        console.error(err)
        process.exit(0)
    }
})

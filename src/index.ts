import Fastify, { FastifyInstance } from "fastify"
import { buildAPIRoutes } from "./routes/routes"
import environment from "./util/config"

const server: FastifyInstance = Fastify({ logger: true })
server.register(buildAPIRoutes)
server.listen(environment.port, "0.0.0.0", (err) => {
    if (err) {
        console.error(err)
        process.exit(0)
    }
})
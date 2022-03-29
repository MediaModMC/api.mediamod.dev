import Fastify, { FastifyInstance } from "fastify"
import { buildAPIRoutes } from "./routes/routes"
import environment from "./util/config"

const server: FastifyInstance = Fastify({ logger: true })
server.register(buildAPIRoutes)
server.listen(environment.port, (err) => {
    if (err) {
        console.error(err)
        process.exit(0)
    }
})
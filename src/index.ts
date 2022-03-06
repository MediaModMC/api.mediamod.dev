import Fastify, { FastifyInstance } from "fastify"
import { buildAPIRoutes } from "./routes/routes"

const server: FastifyInstance = Fastify({ logger: true })
server.register(buildAPIRoutes)
server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(0)
    }

    console.log(`Server listening at ${address}`)
})
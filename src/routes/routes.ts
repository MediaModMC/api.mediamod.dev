import { FastifyInstance, RegisterOptions } from "fastify"
import { spotifyAuthRoute } from "./api/v1"

export function buildAPIRoutes(server: FastifyInstance, options: RegisterOptions, next?: () => void): void {
    server.post("/api/v1/spotify/auth", spotifyAuthRoute)

    if (next)
        next()
}
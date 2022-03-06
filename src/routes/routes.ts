import { FastifyInstance, RegisterOptions } from "fastify"
import { spotifyAuthRoute, spotifyRefreshRoute } from "./api/v1"

export function buildAPIRoutes(server: FastifyInstance, options: RegisterOptions, next?: () => void): void {
    server.post("/api/v1/spotify/auth", spotifyAuthRoute)
    server.post("/api/v1/spotify/refresh", spotifyRefreshRoute)

    if (next)
        next()
}
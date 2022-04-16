import { FastifyInstance, RegisterOptions } from "fastify"
import { modVersionsRoute, spotifyAuthRoute, spotifyRefreshRoute, themesPublishRoute, themesListRoute } from "./api/v1"

export function buildAPIRoutes(server: FastifyInstance, options: RegisterOptions, next?: () => void): void {
    server.post("/api/v1/spotify/auth", spotifyAuthRoute)
    server.post("/api/v1/spotify/refresh", spotifyRefreshRoute)

    server.get("/api/v1/versions", modVersionsRoute)

    server.get("/api/v1/themes/list", themesListRoute)
    server.post("/api/v1/themes/publish", themesPublishRoute)

    if (next) next()
}

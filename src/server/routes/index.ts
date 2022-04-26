import { FastifyInstance, RegisterOptions } from "fastify"
import {
    modVersionsRoute,
    spotifyAuthRoute,
    spotifyRefreshRoute,
    themesPublishRoute,
    themesIdRoute,
    themesIndexRoute
} from "./api/v1"

export function buildAPIRoutes(server: FastifyInstance, options: RegisterOptions, next?: () => void): void {
    server.post("/api/v1/spotify/auth", spotifyAuthRoute)
    server.post("/api/v1/spotify/refresh", spotifyRefreshRoute)

    server.get("/api/v1/versions", modVersionsRoute)

    server.get("/api/v1/themes", themesIndexRoute)
    server.post(
        "/api/v1/themes/publish",
        {
            config: {
                rateLimit: {
                    max: 5,
                    timeWindow: "1 hour"
                }
            }
        },
        themesPublishRoute
    )

    server.get("/api/v1/theme/:id", themesIdRoute)
    // server.get("/api/v1/admin/ban/:uuid", banRoute)

    if (next) next()
}

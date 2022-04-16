import { FastifyRequest } from "fastify"
import { sessionHasJoined } from "../../../../lib/mojang"
import { getServerIdHash } from "../../../../lib/hash"
import { ThemeData } from "../../../../interfaces/ThemeData.interface"
import { ThemeModel } from "../../../../database/themes/themes.model"

interface PublishQuery {
    username: string
    sharedSecret: string
    theme: ThemeData
}

export async function themesPublishRoute(request: FastifyRequest<{ Body: PublishQuery }>) {
    const serverIdHash = getServerIdHash(request.body.sharedSecret)
    const result = await sessionHasJoined(request.body.username, serverIdHash)

    if (!result.ok) {
        return { ok: false, message: result.error }
    }

    const existingTheme = await ThemeModel.findOne({
        author: request.body.username,
        name: request.body.theme.name,
        colors: request.body.theme.colors
    })

    if (existingTheme) {
        return { ok: false, message: "You've already uploaded this theme!" }
    }

    const entry = await ThemeModel.create({
        author: request.body.username,
        name: request.body.theme.name,
        colors: request.body.theme.colors,
        upload_date: Date.now()
    })

    return { ok: true, theme_id: entry.id }
}

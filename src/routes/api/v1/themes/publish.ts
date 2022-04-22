import { FastifyRequest } from "fastify"
import { sessionHasJoined } from "../../../../lib/mojang"
import { getServerIdHash } from "../../../../lib/hash"
import { ThemeData } from "../../../../interfaces/ThemeData.interface"
import Filter from "badwords-filter"
import prisma from "../../../../util/prisma"
import { randomBytes } from "crypto"
import { notifyThemePublish } from "../../../../discord/util"
import logger from "../../../../util/logger"

interface PublishQuery {
    username: string
    uuid: string
    sharedSecret: string
    theme: ThemeData
}

const filter = new Filter()

export async function themesPublishRoute(request: FastifyRequest<{ Body: PublishQuery }>) {
    const serverIdHash = getServerIdHash(request.body.sharedSecret)
    const result = await sessionHasJoined(request.body.username, serverIdHash)

    if (!result.ok) {
        return { ok: false, message: result.error }
    }

    const user = await prisma.user.findFirst({ where: { id: request.body.uuid } })
    if (user?.banned) {
        return { ok: false, message: "Please try again later!" }
    }

    const existingTheme = await prisma.theme.findFirst({
        where: {
            author: { id: request.body.uuid },
            name: request.body.theme.name,
            colors: request.body.theme.colors
        }
    })

    if (existingTheme) {
        return { ok: false, message: "You've already uploaded this theme!" }
    }

    if (filter.isUnclean(request.body.theme.name)) {
        return { ok: false, message: "Invalid theme name!" }
    }

    const id = randomBytes(6).toString("hex")
    const theme = await prisma.theme.create({
        data: {
            id: id,
            author: {
                connectOrCreate: {
                    create: { id: request.body.uuid, name: request.body.username },
                    where: { id: request.body.uuid }
                }
            },
            name: request.body.theme.name,
            colors: { create: request.body.theme.colors }
        },
        include: { author: true }
    })

    notifyThemePublish(theme)
        .then(() => logger.info("Successfully notified theme publish!"))
        .catch((e) => logger.error("Failed to notify theme publish:", e))

    return { ok: true, theme_id: id }
}

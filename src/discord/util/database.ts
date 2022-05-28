import { validate } from "uuid"
import { DatabaseThemeWithAuthorAndColors, DatabaseUserWithThemes, MessageBasedInteraction } from "."
import { error, failure } from "./message"
import logger from "../../util/logger"
import prisma from "../../util/prisma"

export async function lookupUser(
    interaction: MessageBasedInteraction,
    uuid: string | undefined
): Promise<DatabaseUserWithThemes | undefined> {
    if (!uuid || !validate(uuid)) {
        await failure(interaction, "You must supply a valid UUID!")
        return undefined
    }

    try {
        return await prisma.user.findUnique({
            where: { id: uuid },
            include: {
                themes: {
                    orderBy: { upload_date: "desc" }
                }
            },
            rejectOnNotFound: true
        })
    } catch (e: any) {
        logger.error(`Prisma query failed when finding user ${uuid}!`, e)
        await error(interaction, `Error occurred when finding user: \`${uuid}\``, e)

        return undefined
    }
}

export async function lookupTheme(
    interaction: MessageBasedInteraction,
    themeId: string | undefined
): Promise<DatabaseThemeWithAuthorAndColors | undefined> {
    if (!themeId) {
        await failure(interaction, "You must supply a valid theme id!")
        return undefined
    }

    try {
        const result = await prisma.theme.findUnique({
            where: { id: themeId },
            include: {
                author: true,
                colors: {
                    select: {
                        background: true,
                        progress_bar: true,
                        progress_bar_background: true,
                        progress_bar_text: true,
                        text: true
                    }
                }
            },
            rejectOnNotFound: true
        })

        return result as DatabaseThemeWithAuthorAndColors
    } catch (e: any) {
        logger.error(`Prisma query failed when finding theme ${themeId}!`, e)
        await error(interaction, `Error occurred when finding theme: \`${themeId}\``, e)

        return undefined
    }
}

import { validate } from "uuid"
import { DatabaseUserWithThemes, MessageBasedInteraction } from "."
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

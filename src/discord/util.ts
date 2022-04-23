import { AnyChannel, BaseCommandInteraction, ButtonInteraction, MessageEmbed, TextChannel } from "discord.js"
import { Theme, User } from "@prisma/client"
import { client } from "./index"
import config from "../util/config"
import logger from "../util/logger"
import { validate } from "uuid"
import prisma from "../util/prisma"

export type DatabaseUserWithThemes = User & { themes: Theme[] }
export type MessageBasedInteraction = ButtonInteraction | BaseCommandInteraction

export function toDiscordTimestamp(date: Date): string {
    const epoch = (date.getTime() / 1000).toFixed(0)
    return `<t:${epoch}>`
}

export async function success(interaction: MessageBasedInteraction, content: string) {
    return await interaction.editReply({ content: `✅ ${content}` })
}

export async function failure(interaction: MessageBasedInteraction, content: string) {
    return await interaction.editReply({ content: `😢 ${content}` })
}

export async function error(interaction: MessageBasedInteraction, content: string, e: any) {
    const formatted = JSON.stringify(e, undefined, 2)
    const json = `\`\`\`json\n${formatted}\`\`\``

    await failure(interaction, `${content}:\n${json}`)
}

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

export async function notifyThemePublish(theme: Theme & { author: User }) {
    const id = config.discord.notify_channel
    if (!id) return logger.warn("No notify channel setup! Not notifying about theme publish.")

    let channel: AnyChannel | null
    try {
        channel = await client.channels.fetch(id)
    } catch (e) {
        return logger.error("An error occurred when fetching the notify channel:", e)
    }

    if (!channel || !(channel instanceof TextChannel)) {
        return logger.warn("Invalid notify channel! Not notifying about theme publish.")
    }

    const embed = new MessageEmbed()
        .setTitle("Theme published!")
        .setColor("GREYPLE")
        .setThumbnail(`https://crafthead.net/avatar/${theme.author.id}`)
        .addField("Name", `\`${theme.name}\``, true)
        .addField("ID", theme.id, true)
        .addField("User ID", `${theme.author.id}`, false)
        .addField("Username", theme.author.name, true)
        .addField("Date", toDiscordTimestamp(theme.upload_date), true)

    await channel.send({ embeds: [embed] })
}

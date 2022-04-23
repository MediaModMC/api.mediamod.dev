import { Theme, User } from "@prisma/client"
import { AnyChannel, MessageEmbed, TextChannel } from "discord.js"
import { client } from ".."
import config from "../../util/config"
import logger from "../../util/logger"
import { toDiscordTimestamp } from "./formats"

type DatabaseThemeWithAuthor = Theme & { author: User }

export async function notifyThemePublish(theme: DatabaseThemeWithAuthor) {
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

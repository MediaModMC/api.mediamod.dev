import { AnyChannel, BaseCommandInteraction, ButtonInteraction, MessageEmbed, TextChannel } from "discord.js"
import { Theme, User } from "@prisma/client"
import { client } from "./index"
import config from "../util/config"
import logger from "../util/logger"

export async function success(interaction: ButtonInteraction | BaseCommandInteraction, content: string) {
    return await interaction.editReply({ content: `✅ ${content}` })
}

export async function failure(interaction: ButtonInteraction | BaseCommandInteraction, content: string) {
    return await interaction.editReply({ content: `😢 ${content}` })
}

export async function error(interaction: ButtonInteraction | BaseCommandInteraction, content: string, e: any) {
    const formatted = JSON.stringify(e, undefined, 2)
    const json = `\`\`\`json\n${formatted}\`\`\``

    await failure(interaction, `${content}:\n${json}`)
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
        .addField("Date", `<t:${(theme.upload_date.getTime() / 1000).toFixed(0)}>`, true)

    await channel.send({ embeds: [embed] })
}
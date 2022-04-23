import { Discord, Permission, Slash, SlashOption } from "discordx"
import { Theme } from "@prisma/client"
import { CommandInteraction, MessageEmbed } from "discord.js"
import { DatabaseUserWithThemes } from "../util"
import { lookupUser } from "../util/database"
import { toDiscordTimestamp } from "../util/formats"

import environment from "../../util/config"

@Discord()
export class UserInfoCommand {
    @Slash("userinfo", { description: "Returns information about a user on the MediaMod Themes API" })
    @Permission(false)
    @Permission({ permission: true, type: "ROLE", id: environment.discord.admin_role })
    async userinfo(
        @SlashOption("uuid", { type: "STRING" })
        uuid: string | undefined,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply()

        const user = await lookupUser(interaction, uuid)
        if (!user) return

        const latestTheme = user.themes.at(0)
        const embed = this.generateEmbed(user, latestTheme)
        await interaction.editReply({ embeds: [embed] })
    }

    private generateEmbed(user: DatabaseUserWithThemes, latestTheme: Theme | undefined): MessageEmbed {
        const uploadDate = latestTheme?.upload_date
        const embed = new MessageEmbed()
            .setTitle(`Information for ${user.name}`)
            .setThumbnail(`https://crafthead.net/avatar/${user.id}`)
            .setColor(user.banned ? "ORANGE" : "GREEN")
            .setDescription(`This user has **${user.themes.length} themes** published.`)
            .addField("UUID", `\`${user.id}\``)
            .addField("Banned", user.banned ? "Yes" : "No", true)
            .addField("Last theme upload", uploadDate ? toDiscordTimestamp(uploadDate) : "Never", true)

        return embed
    }
}

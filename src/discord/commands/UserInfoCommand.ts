import { Discord, Permission, Slash, SlashOption } from "discordx"
import { validate } from "uuid"
import { Theme, User } from "@prisma/client"
import { CommandInteraction, MessageEmbed } from "discord.js"
import { error, failure, lookupUser } from "../util"

import prisma from "../../util/prisma"
import environment from "../../util/config"

type DatabaseUser = User & { themes: Theme[] }

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

        const latestTheme = user.themes
            .sort((a, b) => {
                const dateA = a.upload_date.getTime()
                const dateB = b.upload_date.getTime()

                return dateA < dateB ? 1 : -1
            })
            .at(0)

        const embed = new MessageEmbed()
            .setTitle(`Information for ${user.name}`)
            .setThumbnail(`https://crafthead.net/avatar/${user.id}`)
            .setColor(user.banned ? "ORANGE" : "GREEN")
            .setDescription(`This user has **${user.themes.length} themes** published.`)
            .addField("UUID", `\`${user.id}\``)
            .addField("Banned", user.banned ? "Yes" : "No", true)
            .addField(
                "Last theme upload",
                latestTheme?.upload_date ? `<t:${(latestTheme.upload_date.getTime() / 1000).toFixed(0)}>` : "Never",
                true
            )

        await interaction.editReply({ embeds: [embed] })
    }
}

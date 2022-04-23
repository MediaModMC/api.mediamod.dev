import { ButtonComponent, Discord, Permission, Slash, SlashOption } from "discordx"
import { validate } from "uuid"
import { Theme, User } from "@prisma/client"
import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from "discord.js"
import { error, failure, lookupUser, success } from "../util"

import prisma from "../../util/prisma"
import environment from "../../util/config"

type DatabaseUser = User & { themes: Theme[] }

@Discord()
export class UnbanCommand {
    databaseUsers: Record<string, DatabaseUser> = {}

    @Slash("unban", { description: "Allow a user to publish MediaMod themes." })
    @Permission(false)
    @Permission({ permission: true, type: "ROLE", id: environment.discord.admin_role })
    async unban(
        @SlashOption("uuid", { type: "STRING" })
        uuid: string | undefined,
        interaction: CommandInteraction
    ) {
        const message = await interaction.deferReply({ fetchReply: true })
        const user = await lookupUser(interaction, uuid)
        if (!user) return

        if (!user.banned) {
            return await failure(interaction, `The user **${user.name}** (\`${user.id}\`) is not banned!`)
        }

        this.databaseUsers[message.id] = user
        const row = new MessageActionRow().addComponents([
            new MessageButton().setLabel("Confirm").setStyle("SUCCESS").setCustomId("unban-confirm-button"),
            new MessageButton().setLabel("Cancel").setStyle("SECONDARY").setCustomId("unban-cancel-button")
        ])

        await interaction.editReply({
            components: [row],
            content: `🤔 Please confirm that you would like to unban the user **${user.name}** (\`${user.id}\`).`
        })
    }

    @ButtonComponent("unban-confirm-button")
    async confirmButton(interaction: ButtonInteraction) {
        await interaction.deferReply()

        const user = this.databaseUsers[interaction.message.id]
        if (!user) {
            return await failure(interaction, "This interaction has expired!")
        }

        try {
            const updatedUser = await prisma.user.update({ where: { id: user.id }, data: { banned: false } })
            await success(interaction, `**${updatedUser.name}** (\`${updatedUser.id}\`) has been unbanned!`)
        } catch (e: any) {
            await error(interaction, `Failed to unban user **${user.name}** (\`${user.id}\`)`, e)
        }

        delete this.databaseUsers[interaction.message.id]
    }

    @ButtonComponent("unban-cancel-button")
    async cancelButton(interaction: ButtonInteraction) {
        await interaction.deferReply()

        const user = this.databaseUsers[interaction.message.id]
        if (!user) {
            return await failure(interaction, "This interaction has expired!")
        }

        await success(interaction, `Unban for **${user.name}** (\`${user.id}\`) has been cancelled`)
        delete this.databaseUsers[interaction.message.id]
    }
}

import { ButtonComponent, Discord, Permission, Slash, SlashOption } from "discordx"
import { validate } from "uuid"
import { Theme, User } from "@prisma/client"
import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from "discord.js"
import { error, failure, success } from "../util"

import prisma from "../../util/prisma"
import environment from "../../util/config"

type DatabaseUser = User & { themes: Theme[] }

@Discord()
export class BanCommand {
    databaseUsers: Record<string, DatabaseUser> = {}

    @Slash("ban", { description: "Prevents a user from publishing MediaMod themes." })
    @Permission(false)
    @Permission({ permission: true, type: "ROLE", id: environment.discord.admin_role })
    async ban(
        @SlashOption("uuid", { type: "STRING" }) uuid: string | undefined,
        interaction: CommandInteraction
    ) {
        const message = await interaction.deferReply({ fetchReply: true })

        if (!uuid || !validate(uuid)) {
            return await failure(interaction, "You must supply a valid UUID!")
        }

        let user: DatabaseUser
        try {
            user = await prisma.user.findUnique({
                where: { id: uuid },
                include: { themes: true },
                rejectOnNotFound: true
            })
        } catch (e: any) {
            return await error(interaction, `Error occurred when finding user: \`${uuid}\``, e)
        }

        if (user.banned) {
            return await failure(interaction, `The user **${user.name}** (\`${user.id}\`) is already banned!`)
        }

        this.databaseUsers[message.id] = user
        const row = new MessageActionRow().addComponents([
            new MessageButton().setLabel("Confirm").setStyle("DANGER").setCustomId("ban-confirm-button"),
            new MessageButton().setLabel("Cancel").setStyle("SECONDARY").setCustomId("ban-cancel-button")
        ])

        await interaction.editReply({
            components: [row],
            content: `🤔 Please confirm that you would like to ban the user **${user.name}** (\`${user.id}\`).\nThey have **${user.themes.length} themes** published, these won't be removed.`
        })
    }

    @ButtonComponent("ban-confirm-button")
    async confirmButton(interaction: ButtonInteraction) {
        await interaction.deferReply()

        const user = this.databaseUsers[interaction.message.id]
        if (!user) {
            return await failure(interaction, "This interaction has expired!")
        }

        try {
            const updatedUser = await prisma.user.update({ where: { id: user.id }, data: { banned: true } })
            await success(interaction, `**${updatedUser.name}** (\`${updatedUser.id}\`) has been banned!`)
        } catch (e: any) {
            await error(interaction, `Failed to ban user **${user.name}** (\`${user.id}\`)`, e)
        }

        delete this.databaseUsers[interaction.message.id]
    }

    @ButtonComponent("ban-cancel-button")
    async cancelButton(interaction: ButtonInteraction) {
        await interaction.deferReply()

        const user = this.databaseUsers[interaction.message.id]
        if (!user) {
            return await failure(interaction, "This interaction has expired!")
        }

        await success(interaction, `Ban for **${user.name}** (\`${user.id}\`) has been cancelled`)
        delete this.databaseUsers[interaction.message.id]
    }
}

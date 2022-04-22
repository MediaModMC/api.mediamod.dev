import { ButtonComponent, Discord, Permission, Slash, SlashOption } from "discordx"
import { validate } from "uuid"
import { User } from "@prisma/client"
import {
    BaseCommandInteraction,
    ButtonInteraction,
    CommandInteraction,
    MessageActionRow,
    MessageButton
} from "discord.js"

import prisma from "../../util/prisma"
import environment from "../../util/config"

@Discord()
export class BanCommand {
    databaseUsers: Record<string, User> = {}

    @Slash("ban", { description: "Prevents a user from publishing MediaMod themes." })
    @Permission(false)
    @Permission({ permission: true, type: "ROLE", id: environment.discord.admin_role })
    async ban(
        @SlashOption("uuid", { type: "STRING" })
        uuid: string | undefined,
        interaction: CommandInteraction
    ) {
        const message = await interaction.deferReply({ fetchReply: true })

        if (!uuid || !validate(uuid)) {
            return await this.failure(interaction, "You must supply a valid UUID!")
        }

        let user: User
        try {
            user = await prisma.user.findUnique({ where: { id: uuid }, rejectOnNotFound: true })
        } catch (e: any) {
            return await this.error(interaction, `Error occurred when finding user: \`${uuid}\``, e)
        }

        if (user.banned) {
            return await this.failure(interaction, `The user **${user.name}** (\`${user.id}\`) is already banned!`)
        }

        this.databaseUsers[message.id] = user
        const row = new MessageActionRow().addComponents([
            new MessageButton().setLabel("Confirm").setStyle("DANGER").setCustomId("confirm-button"),
            new MessageButton().setLabel("Cancel").setStyle("SECONDARY").setCustomId("cancel-button")
        ])

        await interaction.editReply({
            components: [row],
            content: `🤔 Please confirm that you would like to ban the user **${user.name}** (\`${user.id}\`)`
        })
    }

    @ButtonComponent("confirm-button")
    async confirmButton(interaction: ButtonInteraction) {
        await interaction.deferReply()

        const user = this.databaseUsers[interaction.message.id]
        if (!user) {
            return await this.failure(interaction, "This interaction has expired!")
        }

        try {
            const updatedUser = await prisma.user.update({ where: { id: user.id }, data: { banned: true } })
            await this.success(interaction, `**${updatedUser.name}** (\`${updatedUser.id}\`) has been banned!`)
        } catch (e: any) {
            await this.error(interaction, `Failed to ban user **${user.name}** (\`${user.id}\`)`, e)
        }

        delete this.databaseUsers[interaction.message.id]
    }

    @ButtonComponent("cancel-button")
    async cancelButton(interaction: ButtonInteraction) {
        await interaction.deferReply()

        const user = this.databaseUsers[interaction.message.id]
        if (!user) {
            return await this.failure(interaction, "This interaction has expired!")
        }

        await this.success(interaction, `Ban for **${user.name}** (\`${user.id}\`) has been cancelled`)
        delete this.databaseUsers[interaction.message.id]
    }

    async success(interaction: ButtonInteraction | BaseCommandInteraction, content: string) {
        return await interaction.editReply({ content: `✅ ${content}` })
    }

    async failure(interaction: ButtonInteraction | BaseCommandInteraction, content: string) {
        return await interaction.editReply({ content: `😢 ${content}` })
    }

    async error(interaction: ButtonInteraction | BaseCommandInteraction, content: string, e: any) {
        const formatted = JSON.stringify(e, undefined, 2)
        const json = `\`\`\`json\n${formatted}\`\`\``

        await this.failure(interaction, `${content}:\n${json}`)
    }
}

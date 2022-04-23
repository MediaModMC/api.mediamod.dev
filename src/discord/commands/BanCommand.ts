import { ButtonComponent, Discord, Permission, Slash, SlashOption } from "discordx"
import { PrismaPromise } from "@prisma/client"
import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from "discord.js"
import { DatabaseUserWithThemes } from "../util"
import { lookupUser } from "../util/database"
import { failure, success, error } from "../util/message"

import prisma from "../../util/prisma"
import environment from "../../util/config"
import logger from "../../util/logger"

@Discord()
export class BanCommand {
    databaseUsers: Record<string, { user: DatabaseUserWithThemes; destructive: boolean }> = {}

    @Slash("ban", { description: "Prevents a user from publishing MediaMod themes." })
    @Permission(false)
    @Permission({ permission: true, type: "ROLE", id: environment.discord.admin_role })
    async ban(
        @SlashOption("uuid", { type: "STRING" })
        uuid: string | undefined,
        @SlashOption("destructive", { type: "BOOLEAN" })
        destructive: boolean | undefined,
        interaction: CommandInteraction
    ) {
        const message = await interaction.deferReply({ fetchReply: true })
        const user = await lookupUser(interaction, uuid)
        if (!user) return

        if (user.banned) {
            return await failure(interaction, `The user **${user.name}** (\`${user.id}\`) is already banned!`)
        }

        this.databaseUsers[message.id] = { destructive: destructive ?? false, user: user }
        const row = new MessageActionRow().addComponents([
            new MessageButton().setLabel("Confirm").setStyle("DANGER").setCustomId("ban-confirm-button"),
            new MessageButton().setLabel("Cancel").setStyle("SECONDARY").setCustomId("ban-cancel-button")
        ])

        await interaction.editReply({
            components: [row],
            content: `🤔 Please confirm that you would like to ban the user **${user.name}** (\`${
                user.id
            }\`).\nThey have **${user.themes.length} themes** published, these ${
                destructive ? "__**will**__" : "won't"
            } be removed.`
        })
    }

    @ButtonComponent("ban-confirm-button")
    async confirmButton(interaction: ButtonInteraction) {
        await interaction.deferReply()

        const { user, destructive } = this.databaseUsers[interaction.message.id]
        if (!user) {
            return await failure(interaction, "This interaction has expired!")
        }

        try {
            const queries: PrismaPromise<any>[] = [
                prisma.user.update({ data: { banned: true }, where: { id: user.id } })
            ]

            if (destructive) {
                queries.push(prisma.theme.deleteMany({ where: { userId: user.id } }))
            }

            const [updatedUser] = await prisma.$transaction(queries)
            await success(
                interaction,
                `**${updatedUser.name}** (\`${updatedUser.id}\`) has been banned!${destructive ? " 🔥" : ""}`
            )
        } catch (e: any) {
            logger.error(`Prisma transaction failed for ban of user ${user.name} (${user.id}`, e)
            await error(interaction, `Failed to ban user **${user.name}** (\`${user.id}\`)`, e)
        }

        delete this.databaseUsers[interaction.message.id]
    }

    @ButtonComponent("ban-cancel-button")
    async cancelButton(interaction: ButtonInteraction) {
        await interaction.deferReply()

        const { user, destructive } = this.databaseUsers[interaction.message.id]
        if (!user) {
            return await failure(interaction, "This interaction has expired!")
        }

        await success(
            interaction,
            `Ban for **${user.name}** (\`${user.id}\`) has been cancelled${destructive ? ` (**Destructive!**)` : ""}`
        )

        delete this.databaseUsers[interaction.message.id]
    }
}

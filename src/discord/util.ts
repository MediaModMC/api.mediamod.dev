import { BaseCommandInteraction, ButtonInteraction } from "discord.js"

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
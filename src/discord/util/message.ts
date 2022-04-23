import { MessageBasedInteraction } from "."

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

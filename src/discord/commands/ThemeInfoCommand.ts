import { Discord, Slash, SlashOption } from "discordx"
import { CommandInteraction, HexColorString, MessageEmbed } from "discord.js"
import { lookupTheme } from "../util/database"
import { toDiscordTimestamp } from "../util/formats"
import { DatabaseThemeWithAuthorAndColors } from "../util"

@Discord()
export class ThemeInfoCommand {
    @Slash("themeinfo", { description: "Returns information about a theme on the MediaMod Themes API" })
    async userinfo(
        @SlashOption("theme_id", { type: "STRING" })
        themeId: string | undefined,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply()

        const theme = await lookupTheme(interaction, themeId)
        if (!theme) return

        const embed = this.generateEmbed(theme)
        await interaction.editReply({ embeds: [embed] })
    }

    private generateEmbed(theme: DatabaseThemeWithAuthorAndColors) {
        return new MessageEmbed()
            .setTitle("Theme Information")
            .addField("Name", theme.name, true)
            .addField("ID", `\`${theme.id}\``, true)
            .addField("Upload date", toDiscordTimestamp(theme.upload_date), true)
            .addField("Author", `${theme.author.name} (\`${theme.author.id}\`)`, true)
            .addField("Colors", `\`\`\`json\n${JSON.stringify(theme.colors, undefined, 2)}\n\`\`\``)
            .setColor(theme.colors.progress_bar as HexColorString)
    }
}

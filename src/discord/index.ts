import { Client } from "discordx"
import { dirname, importx } from "@discordx/importer"
import { Intents, Interaction } from "discord.js"

import environment from "../util/config"

async function init() {
    const client = new Client({
        botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
        intents: [Intents.FLAGS.GUILDS],
        silent: false
    })

    client.on("ready", async () => {
        await client.guilds.fetch()
        await client.initApplicationCommands()
        await client.initApplicationPermissions()
    })

    client.on("interactionCreate", (interaction: Interaction) => {
        client.executeInteraction(interaction)
    })

    await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}")
    await client.login(environment.discord.token)
}

init()

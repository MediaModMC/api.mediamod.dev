import { Client } from "discordx"
import environment from "../util/config"
import { dirname, importx } from "@discordx/importer"

async function init() {
    const client = new Client({
        intents: [],
        silent: false
    })

    client.on("ready", async () => {
        await client.initApplicationCommands()
        await client.initApplicationPermissions()
    })

    await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}")
    await client.login(environment.discord.token)
}

init()

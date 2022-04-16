import fetch from "node-fetch"
import { SessionHasJoinedResponse } from "../interfaces/MojangResponse.interface"

export type SessionHasJoinedResult = { ok: true; value: SessionHasJoinedResponse } | { ok: false; error: string }

export async function sessionHasJoined(username: string, serverIdHash: string): Promise<SessionHasJoinedResult> {
    const response = await fetch(
        `https://sessionserver.mojang.com/session/minecraft/hasJoined?username=${username}&serverId=${serverIdHash}`,
        { method: "GET" }
    )

    const json = await response.json()
    if (response.status != 200) {
        return { error: "Invalid username and/or server hash", ok: false }
    }

    return { value: json as SessionHasJoinedResponse, ok: true }
}

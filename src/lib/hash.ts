import * as crypto from "crypto"
import { TextEncoder } from "util"

const encoder = new TextEncoder()
const sharedConstant = encoder.encode("82074fcd6eef4cafbc954dac50485fb7")

export function sha1(bytes: Buffer) {
    const hash = crypto.createHash("sha1")
    return hash.update(bytes).digest("hex")
}

export function getServerIdHash(sharedSecret: string): string {
    const sharedSecretBytes = Buffer.from(sharedSecret, "hex")
    const buffer = Buffer.concat([sharedSecretBytes, sharedConstant])

    return sha1(buffer)
}

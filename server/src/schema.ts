import * as crypto from 'crypto'

// Keep compatibility with existing values in mind when
// making changes to the schema.
// Same goes for evolvability.

export type SnippetID = string

export interface StoredValue {
    version: 1
    code: string
}

export interface SnippetStorage {
    get(id: SnippetID): Promise<StoredValue|undefined>
    save(contents: StoredValue): Promise<SnippetID>

    waitUntilReady(): Promise<void>
    healthCheck(): Promise<boolean>
}

export class IdGenerator {
    constructor(
        private exists: (id: SnippetID) => Promise<boolean>,
        private random: (size: number) => Buffer = crypto.randomBytes
    ) { }

    async newId() {
        let id: string
        let tries = 0
        while(true) {
            id = this.random(3).toString('hex')
            if (!await this.exists(id)) {
                break
            }
            tries++
            if (tries === 10) {
                throw new Error("Failed to generate a unique new id.")
            }
        }
        return id
    }
}

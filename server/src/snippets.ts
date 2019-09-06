import * as crypto from 'crypto'
import levelup, { LevelUp } from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'

interface StoredValue {
    version: number
    code: string
}

export function makeSnippet(code: string): StoredValue {
    return {
        version: 1,
        code
    }
}

export class SnippetStorage {
    constructor(
        private db: LevelUp,
        private random: (size: number) => Buffer = crypto.randomBytes
    ) {

    }

    static withFile(filename: string) {
        return new SnippetStorage(levelup(encode(leveldown(filename), { valueEncoding: 'json' })))
    }

    async save(contents: StoredValue) {
        const id = await this.newId()
        return new Promise<string>((resolve, reject) => {
            this.db.put(id, contents, (err?: any) => {
                if (err) { return reject(err) }
                resolve(id)
            })
        })
    }

    async get(id: string) {
        return new Promise<StoredValue|undefined>((resolve, reject) => {
            this.db.get(id, (err: any, value: any) => {
                if (!err) {
                    try {
                        const data = value
                        return resolve(data)
                    }catch(e) {
                        return reject(e)
                    }
                }
                else if (err.type == 'NotFoundError') { return resolve(undefined) }
                else { reject(err) }
            })
        })
    }

    async exists(id: string) {
        try {
            return await this.get(id) !== undefined
        }catch(e) {
            return false
        }
    }

    private async newId() {
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

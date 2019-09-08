import levelup, { LevelUp } from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'
import { StoredValue, SnippetStorage, IdGenerator } from './schema'

export class LevelDBStorage implements SnippetStorage {
    constructor(private db: LevelUp) { }

    private idGenerator = new IdGenerator(this.exists.bind(this))

    static withFile(filename: string) {
        return new LevelDBStorage(levelup(encode(leveldown(filename), { valueEncoding: 'json' })))
    }

    async save(contents: StoredValue) {
        const id = await this.idGenerator.newId()
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

    async waitUntilReady() {
        return
    }

    async healthCheck() {
        return true // TODO
    }

    async exists(id: string) {
        try {
            return await this.get(id) !== undefined
        }catch(e) {
            return false
        }
    }
}

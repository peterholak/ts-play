import { SnippetStorage, StoredValue, SnippetID, IdGenerator } from "./schema"
import * as PgPool from 'pg-pool'

export class PostgresStorage implements SnippetStorage {
    constructor(
        private host: string,
        private port: number,
        private user: string,
        private password: string,
        private database: string
    ) { }

    private pool = new PgPool({
        host: this.host,
        port: this.port,
        database: this.database,
        user: this.user,
        password: this.password,
        ssl: false,
        min: 1,
        max: 10,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000
    })

    private idGenerator = new IdGenerator(this.exists.bind(this))

    async get(id: SnippetID): Promise<StoredValue | undefined> {
        const result = await this.pool.query(
            'SELECT data FROM tsplay.snippets WHERE id = $1',
            [id]
        )
        if (result.rowCount === 0) {
            return undefined
        }
        // TODO: schema validation? does it even make sense given the versioning stuff? just add everything new as optional?
        return result.rows[0]['data']
    }

    async save(contents: StoredValue): Promise<SnippetID> {
        const id = await this.idGenerator.newId()
        await this.pool.query(
            'INSERT INTO tsplay.snippets(id, data) VALUES($1, $2)',
            [id, JSON.stringify(contents)]
        )
        return id
    }

    async waitUntilReady() {
        const connection = await this.pool.connect()
        await connection.query(`
            CREATE SCHEMA IF NOT EXISTS tsplay;
        `)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tsplay.snippets(
                id VARCHAR(10) PRIMARY KEY,
                data JSONB
            );
        `)
    }

    async healthCheck() {
        return true // TODO
    }

    async exists(id: SnippetID) {
        const result = await this.pool.query('SELECT COUNT(*) AS count FROM tsplay.snippets WHERE id = $1', [id])
        const count = parseInt(result.rows[0]['count'])
        if (isNaN(count)) {
            throw new Error("Query didn't return a number")
        }
        return count > 0
    }
}

import { assert } from 'chai'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { LevelDBStorage } from '../src/storage-leveldb'
import levelup from 'levelup'
import memdown from 'memdown'
import encode from 'encoding-down'
import { IdGenerator, StoredValue } from '../src/schema'

chai.use(chaiAsPromised)

describe("IdGenerator", () => {

    it("does not collide with any existing value", async () => {
        const random = new MockRandom()
        const existing: {[id: string]: any} = {}
        const generator = new IdGenerator(
            id => Promise.resolve(existing[id] !== undefined),
            random.get.bind(random)
        )
        const firstId = await generator.newId()
        existing[firstId] = true
        random.goBack()
        const secondId = await generator.newId()

        assert.notEqual(firstId, secondId)
    })

    it("gives up after 10 tries with collisions", async () => {
        const random = new MockRandom(false)
        const existing: {[id: string]: any} = {}
        const generator = new IdGenerator(
            id => Promise.resolve(existing[id] !== undefined),
            random.get.bind(random)
        )
        const firstId = await generator.newId()
        existing[firstId] = true
        random.goBack()
        
        await assert.isRejected(generator.newId())
        assert.equal(random.counter, 10)
    })
})

describe("LevelDBStorage", () => {

    function storage() { 
        return new LevelDBStorage(levelup(encode(memdown(), { valueEncoding: 'json' })))
    }
    const data = { version: 1, code: "code" } as const

    describe("#save return value", () => {

        it("has the configured length", async () => {
            const id = await storage().save(data)
            assert.equal(6, id.length)
        })

        it("only contains lowercase alphanumerical characters", async () => {
            const id = await storage().save(data)
            assert.match(id, /^[a-z0-9]+$/)
        })
    })

    describe("get and save", () => {

        it("resolves to undefined when the key does not exist", async () => {
            const s = storage()
            assert.isUndefined(await s.get("non-existent"))
        })

        it("gets back the stored data", async() => {
            const s = storage()
            const id = await s.save({ version: 1, code: "Hello" })
            const data = await s.get(id)

            assert.notEqual(undefined, data)
            assert.equal(data!.version, 1)
            assert.equal(data!.code, "Hello")
        })

    })
})
    
class MockRandom {
    counter = 0
    constructor(public useCounter = true) { }
    get(size: number) {
        this.counter++
        return Buffer.from(Array(size).fill(this.useCounter ? this.counter : 0))
    }
    goBack() { this.counter-- }
}

import { assert } from 'chai'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { SnippetStorage } from '../src/snippets'
import levelup from 'levelup'
import memdown from 'memdown'
import encode from 'encoding-down'

chai.use(chaiAsPromised)

describe("SnippetStorage", () => {

    function storage(random?: (number: number) => Buffer) { 
        return new SnippetStorage(levelup(encode(memdown(), { valueEncoding: 'json' })), random)
    }
    const data = { version: 1, code: "code" }

    describe("#save return value", () => {

        it("has the configured length", async () => {
            const id = await storage().save(data)
            assert.equal(6, id.length)
        })

        it("only contains lowercase alphanumerical characters", async () => {
            const id = await storage().save(data)
            assert.match(id, /^[a-z0-9]+$/)
        })

        it("does not collide with any existing value", async () => {
            const random = new MockRandom()
            const s = storage(random.get.bind(random))
            const firstId = await s.save(data)
            random.goBack()
            const secondId = await s.save(data)

            assert.notEqual(firstId, secondId)
        })

        it("gives up after 10 tries with collisions", async () => {
            const random = new MockRandom(false)
            const s = storage(random.get.bind(random))
            const firstId = await s.save(data)
            random.goBack()
            
            await assert.isRejected(s.save(data))
            assert.equal(random.counter, 10)
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

    
    class MockRandom {
        counter = 0
        constructor(public useCounter = true) { }
        get(size: number) {
            this.counter++
            return Buffer.from(Array(size).fill(this.useCounter ? this.counter : 0))
        }
        goBack() { this.counter-- }
    }
})



jest.setTimeout(50000)
import {createDeposit, rbigInt} from 'libcream'
import {compileAndLoadCircuit, executeCircuit} from 'cream-circuits'

const {MerkleTree} = require('cream-merkle-tree')
const LENGTH = 31
const LEVELS = 2
const ZERO_VALUE = 0
const batchSize = 2

describe("BatchVote circuits", () => {
  let tree, circuit

  beforeAll(() => {
    tree = new MerkleTree(
      LEVELS,
      ZERO_VALUE
    )
  })

  describe("BatchVote(2, 2)", () => {
    it("should work", async () => {
      circuit = await compileAndLoadCircuit("../../../circuits/test/batchvote_test.circom")
    })
  })
})

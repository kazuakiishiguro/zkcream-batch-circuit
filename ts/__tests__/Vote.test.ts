jest.setTimeout(50000)
import {createDeposit, rbigInt} from 'libcream'
import {compileAndLoadCircuit, executeCircuit} from 'cream-circuits'

const { MerkleTree } = require('cream-merkle-tree')
const LENGTH = 31
const LEVELS = 2
const ZERO_VALUE = 0
let tree

describe("Vote circuits", () => {
  let circuit

  beforeAll(() => {
    tree = new MerkleTree(
      LEVELS,
      ZERO_VALUE
    )
  })

  describe("Vote()", () => {
    it("should return correct root", async () => {
      circuit = await compileAndLoadCircuit("../../../circuits/test/vote_test.circom")

      const {
	commitment,
	nullifierHash,
	nullifier,
	secret
      } = createDeposit(rbigInt(LENGTH), rbigInt(LENGTH))

      tree.insert(commitment)

      const root = tree.root
      const merkleProof = tree.getPathUpdate(0)

      const input = {
	root,
	nullifierHash,
	nullifier,
	secret,
	path_elements: merkleProof[0],
	path_index: merkleProof[1]
      }

      const witness = await executeCircuit(circuit, input)
      const circuitRoot = witness[circuit.symbols["main.new_root"].varIdx]
      expect(circuitRoot.toString()).toEqual(root.toString())
    })
  })
})

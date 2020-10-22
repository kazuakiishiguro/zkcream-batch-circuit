jest.setTimeout(50000)
import {createDeposit, rbigInt} from 'libcream'
import {compileAndLoadCircuit, executeCircuit} from 'cream-circuits'

import {CircuitInput, Deposit} from '../'

const { MerkleTree } = require('cream-merkle-tree')
const LENGTH = 31
const LEVELS = 2
const ZERO_VALUE = 0

describe("Vote circuits", () => {
  let tree, circuit

  beforeAll(() => {
    tree = new MerkleTree(
      LEVELS,
      ZERO_VALUE
    )
  })

  describe("Vote(2)", () => {
    it("should return correct root", async () => {
      circuit = await compileAndLoadCircuit("../../../circuits/test/vote_test.circom")

      for (let i = 0; i < 2**LEVELS; i++) {
	const deposit: Deposit = createDeposit(rbigInt(LENGTH), rbigInt(LENGTH))

	tree.insert(deposit.commitment)

	const root = tree.root
	const merkleProof = tree.getPathUpdate(i)

	const input: CircuitInput = {
	  root,
	  nullifierHash: deposit.nullifierHash,
	  nullifier: deposit.nullifier,
	  secret: deposit.secret,
	  path_elements: merkleProof[0],
	  path_index: merkleProof[1]
	}

	const witness = await executeCircuit(circuit, input)
	const circuitRoot = witness[circuit.symbols["main.new_root"].varIdx]
	expect(circuitRoot.toString()).toEqual(root.toString())
      }
    })
  })
})

jest.setTimeout(50000)
import {SnarkBigInt} from 'libcream'
import {compileAndLoadCircuit, executeCircuit} from 'cream-circuits'

import { CircuitInput, genVote, ProcessVoteAccumulator, copyObject } from '../'

const {MerkleTree} = require('cream-merkle-tree')
const LENGTH = 31
const LEVELS = 2
const ZERO_VALUE = 0
const banntchSize = 2

const arrayBatchSize = [0, 1];

const processVote = (
  acc: ProcessVoteAccumulator
): ProcessVoteAccumulator => {
  const { input, tree } = acc
  return {
    input,
    tree
  }
}

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

      const processedVotes: ProcessVoteAccumulator[] = arrayBatchSize.reduce(
	(acc: ProcessVoteAccumulator[], index) => {
	  if (acc.length === 0) {
	    const { input, commitment } = genVote(tree, LENGTH, index)
	    const processedVote = processVote({
	      input,
	      tree
	    })
	    acc.push(processedVote)
	  } else {
	    // Get last pushed object
	    const lastAcc: ProcessVoteAccumulator = acc.slice(-1)[0]
	    const { input, commitment } = genVote(lastAcc.tree, LENGTH, index)
	    const processedVote = processVote({
	      input,
	      tree: lastAcc.tree
	    })
	    acc.push(processedVote)
	  }

	return acc
	}, [])

      // Construct circuit inputs
      const inputs = processedVotes.reduce(
	(acc, curProcessedTx: ProcessVoteAccumulator) => {
	  const {input, tree} = curProcessedTx

	  Object.keys(acc).forEach(k => {
	    acc[k].push(input[k])
	  })

	  return acc
	},
	{
	  root: [],
	  nullifierHash: [],
	  nullifier: [],
	  secret: [],
	  path_elements: [],
	  path_index: []
	}
      )

      const witness = await executeCircuit(circuit, inputs)
      const circuitRoot: SnarkBigInt = witness[circuit.symbols["main.new_root"].varIdx]

      expect(circuitRoot.toString()).toEqual(tree.root.toString())
    })
  })
})

jest.setTimeout(50000)
import {SnarkBigInt, rbigInt} from 'libcream'
import {compileAndLoadCircuit, executeCircuit} from 'cream-circuits'

import {Deposit, genVote} from '../'

const { MerkleTree } = require('cream-merkle-tree')
const LENGTH = 31
const LEVELS = 2
const ZERO_VALUE = 0

describe("Vote circuits", () => {
  let tree, circuit

  beforeAll(async () => {
    circuit = await compileAndLoadCircuit("../../../circuits/test/vote_test.circom")
    tree = new MerkleTree(
      LEVELS,
      ZERO_VALUE
    )
  })

  describe("Vote(2)", () => {
    it("should return correct root", async () => {
      for (let i = 0; i < 2**LEVELS; i++) {
	const { input } = genVote(tree, LENGTH, i)

	const witness = await executeCircuit(circuit, input)
	const circuitRoot: SnarkBigInt = witness[circuit.symbols["main.new_root"].varIdx]
	expect(circuitRoot.toString()).toEqual(input.root.toString())
      }
    })

    it("should fail when sender sends invalid commitment (nullifier)", async () => {
      let { input } = genVote(tree, LENGTH, 0)

      // Change nullifier value
      input.nullifier = rbigInt(31)

      try {
	await executeCircuit(circuit, input)
      } catch {
	expect(true).toBeTruthy()
      }
    })

    it("should fail when sender sends invalid commitment (secret)", async () => {
      let { input } = genVote(tree, LENGTH, 0)

      // Change secret value
      input.secret = rbigInt(31)

      try {
	await executeCircuit(circuit, input)
      } catch {
	expect(true).toBeTruthy()
      }
    })

    it("should fail when sender sends invalid nullifierHash", async () => {
      let { input } = genVote(tree, LENGTH, 0)

      // Change nullifierHash value
      input.nullifierHash = rbigInt(31)

      try {
	await executeCircuit(circuit, input)
      } catch {
	expect(true).toBeTruthy()
      }
    })

    it("should fail when sender sends invalid root", async () => {
      let { input } = genVote(tree, LENGTH, 0)

      // Change root value
      input.root = rbigInt(31)

      try {
	await executeCircuit(circuit, input)
      } catch {
	expect(true).toBeTruthy()
      }
    })
  })
})

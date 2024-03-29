jest.setTimeout(50000)
import {createDeposit, rbigInt } from 'libcream'
import {compileAndLoadCircuit, executeCircuit } from 'cream-circuits'

const LENGTH = 31

describe("MiMC hash circuits", () => {
  let circuit

  beforeAll(async () => {
    circuit = await compileAndLoadCircuit("test/hasher_test.circom")
  })

  describe("Hasher", () => {
    it("should return correct hashed values", async () => {
      const nullifier = rbigInt(LENGTH)
      const secret = rbigInt(LENGTH)
      const deposit = createDeposit(nullifier, secret)

      const input = {
        nullifier,
        secret
      }

      const witness = await executeCircuit(circuit, input)
      expect(witness[circuit.symbols['main.commitment'].varIdx].toString()).toEqual(deposit.commitment.toString())
      expect(witness[circuit.symbols['main.nullifierHash'].varIdx].toString()).toEqual(deposit.nullifierHash.toString())
    })
  })
})

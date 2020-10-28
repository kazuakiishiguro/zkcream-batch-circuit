import { createDeposit, rbigInt, SnarkBigInt } from 'libcream'

const ff = require('ffjavascript')

const stringifyBigInts: (obj:object) => any = ff.utils.stringifyBigInts
const unstringifyBigInts: (obj:object) => any = ff.utils.unstringifyBigInts

export interface Deposit {
  commitment: SnarkBigInt;
  nullifierHash: SnarkBigInt;
  nullifier: SnarkBigInt;
  secret: SnarkBigInt;
}

export interface CircuitInput {
  root: SnarkBigInt;
  nullifierHash: SnarkBigInt;
  nullifier: SnarkBigInt;
  secret: SnarkBigInt;
  path_elements: any[any];
  path_index: any[any];
}

export interface VotedOutput {
  input: CircuitInput,
  commitment: SnarkBigInt
}

export interface ProcessVoteAccumulator {
  input: CircuitInput;
  tree: any;
}

export const copyObject = (a: any):any => {
  if(Array.isArray(a)) {
    return Array.from(a)
  }
  return Object.assign(
    Object.create(Object.getPrototypeOf(a)),
    unstringifyBigInts(stringifyBigInts(a))
  )
}

export const genVote = (
  merkleTree: any,
  length: number,
  index: number
): VotedOutput => {
  const deposit: Deposit = createDeposit(rbigInt(length), rbigInt(length))

  const { commitment, nullifierHash, nullifier, secret } = deposit

  merkleTree.insert(commitment)
  const merkleProof = merkleTree.getPathUpdate(index)

  const input: CircuitInput = {
    root: merkleTree.root,
    nullifierHash: nullifierHash,
    nullifier: nullifier,
    secret: secret,
    path_elements: merkleProof[0],
    path_index: merkleProof[1]
  }

  return {
    input,
    commitment
  }
}

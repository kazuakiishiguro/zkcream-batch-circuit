import { SnarkBigInt } from 'libcream'

export interface CircuitInput {
  root: SnarkBigInt;
  nullifierHash: SnarkBigInt;
  nullifier: SnarkBigInt;
  secret: SnarkBigInt;
  path_elements: any[any];
  path_index: any[any];
}

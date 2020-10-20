include "../node_modules/cream-circuits/circom/merkleTree.circom";
include "./vote.circom";

template BatchVote(
    levels
    batch_size
) {
  // Params:
  //        batch_size: Batch size of tx's to process (usually 2**depth)
  //        levels: MerkleTree depth

  signal output new_root;

  signal input root[batch_size];
  signal input nullifierHash[batch_size];

  // batch process
  component vote[batch_size];
  for (var i = 0; i < batch_size; i++) {
      vote[i] = Vote(levels);

      vote[i].root <== root[i];
      vote[i].nullifierHash <== nullifierhash[i];
  }

  // make sure calculated roots are valid
  for (var i = 1; i < batch_size; i++) {
      root[i] === vote[i - 1].new_root;
  }

  new_root <== vote[batch_size -1].new_root;
}
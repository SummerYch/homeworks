function mv(n, src, des, moves) {
  moves.push([n, src, des]);
  return moves;
}

function hanoi(n, src, mid, des, moves) {
  if (n === 1) {
    mv(n, src, des, moves);
    return;
  }
  hanoi(n - 1, src, des, mid, moves);
  mv(n, src, des, moves);
  hanoi(n - 1, mid, src, des, moves);
}

function records(n, src, mid, des) {
  let moves = [];
  hanoi(n, src, mid, des, moves);
  return moves;
}

module.exports = records;

var fib=function(n){
  switch(n){
  case 0:
  case 1:
    return 1;
  default:
    if(n<0){
      throw new Error('Error Input');
    }
    return fib(n-2)+fib(n-1);
  }
};
exports.fib=fib;
function mv(n, src, des, moves) {
  moves.push([n, src, des]);
}
function hanoi(n, src, mid, des, moves) {
  if (n == 1) {
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
exports.hanoi=records;

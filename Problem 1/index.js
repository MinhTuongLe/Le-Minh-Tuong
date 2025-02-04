var sum_to_n_a = function (n) {
  let sum = 0,
    index = 0;
  while (index <= n) {
    sum += index;
    index += 1;
  }
  return sum;
};

var sum_to_n_b = function (n) {
  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (accum, curr) => accum + curr,
    0
  );
};

var sum_to_n_c = function (n) {
  return (n * (n + 1)) / 2;
};

use dep::std;

#[oracle(getSqrt)]
unconstrained fn sqrt(numbers: [Field; 2]) -> [Field; 2] {}

unconstrained fn get_sqrt(numbers: [Field; 2]) -> [Field; 2] {
    sqrt(numbers)
}

fn main(input: [Field; 2]) {
    let sqrt = get_sqrt(input);
    assert(sqrt[0].pow_32(2) as u64 == input[0] as u64);
    assert(sqrt[1].pow_32(2) as u64 == input[1] as u64);
}

#[test]
fn test_main() {
    let input = [4, 16];
    main(input)
}

#[test(should_fail)]
fn test_fail() {
    let input = [4, 15];
    main(input)
}

// fn main(x: Field, y: Field, sqrt_x: Field, sqrt_y: Field) -> pub Field {
//     let sqrt= get_sqrt([x, y]);
//     assert(sqrt[0].pow_32(2) as u64 == x as u64);
//     assert(sqrt[1].pow_32(2) as u64 == y as u64);
//     assert(sqrt[0] == sqrt_x, "sqrt_x is not the square root of x");
//     assert(sqrt[1] == sqrt_y, "sqrt_y is not the square root of y");
//     sqrt_x * sqrt_y
// }

// #[test]
// fn test_main() {
//     main(9, 16, 3, 4);
// }

// #[test(should_fail)]
// fn test_main_fail() {
//     main(9, 16, 2, 1);
// }
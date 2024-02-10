use dep::std;

#[oracle(getSqrt)]
unconstrained fn sqrt(number: Field) -> Field {}

unconstrained fn get_sqrt(number: Field) -> Field {
    sqrt(number)
}

fn main(x: Field, y: Field, sqrt_x: Field, sqrt_y: Field) -> pub Field {
    assert(get_sqrt(x) == sqrt_x, "sqrt_x is not the square root of x");
    assert(get_sqrt(y) == sqrt_y, "sqrt_y is not the square root of y");
    sqrt_x * sqrt_y
}

#[test]
fn test_main() {
    main(9, 16, 3, 4);
}

#[test(should_fail)]
fn test_main_fail() {
    main(9, 16, 2, 1);
}

use dep::std;

#[oracle(getSqrt)]
unconstrained fn sqrt(number: Field) -> Field { }

unconstrained fn get_sqrt(number: Field) -> Field {
    sqrt(number)
}

fn main(x: Field, y: Field, sqrt_x: Field, y: sqrt_y) -> pub Field {
    assert(x == y, "x is not equal to y");

    assert(get_sqrt(x) == sqrt_x, "sqrt_x is not the square root of x");
    assert(get_sqrt(y) == sqrt_y, "sqrt_y is not the square root of y"); 
    sqrt_x*sqrt_y 
}

#[test]
fn test_main() {
    main(1, 1);
}

#[test(should_fail)]
fn test_main_fail() {
    main(1, 2);
}

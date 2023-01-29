
/**
 * Is of type 'true' if the type 'From' can be assigned to the 'To' type, 'false' otherwise
 */
export type IsAssignable<To, From> = From extends To ? true : false;

/**
 * Is of type 'true' if the type 'From' can not be assigned to the 'To' type, 'false' otherwise.
 */
export type IsNotAssignable<To, From> = From extends To ? false : true;

/**
 * Used to assert a type constraint.
 */
export function typeAssert<T extends true>() {
}

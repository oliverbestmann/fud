import {SourceType, Type} from '../type';
import {matches} from '../internal/matches';

interface TypeConstructor<T> extends Function {
    new(...args: any[]): T;
}

/**
 * Returns a type that accepts any value and identifies itself statically as `unknown`.
 */
export function unknown(): SourceType<unknown> {
    return new Type('unknown', value => value);
}

/**
 * Returns a Type that accepts any value.
 */
export function any(): Type<any, any> {
    return new Type('any', () => null);
}

/**
 * Returns a Type that accepts a string.
 */
export function string(): SourceType<string> {
    return new Type('string', matches('string', t => typeof t === 'string'));
}

/**
 * Returns a Type that accepts a boolean value.
 */
export function boolean(): SourceType<boolean> {
    return new Type('boolean', matches('boolean', t => typeof t === 'boolean'));
}

/**
 * Returns a Type that accepts a numeric value.
 */
export function number(): SourceType<number> {
    return new Type(`number`, matches('number', t => typeof t === 'number'));
}

/**
 * Returns a Type that accepts a literal value.
 */
export function literal<K extends string | null | undefined | number | boolean>(lit: K): SourceType<K> {
    return new Type(JSON.stringify(lit), matches(`literal '${lit}'`, t => t === lit));
}

/**
 * Returns a Type that accepts a null value.
 */
export function nullValue(): SourceType<null> {
    return literal(null);
}

/**
 * Returns a Type that accepts an undefined value.
 */
export function undefinedValue(): SourceType<undefined> {
    return literal(undefined);
}

/**
 * Returns a Type that accepts a type that is an instance of type t.
 * The check is performed using instanceOf
 */
export function instanceOf<T>(t: TypeConstructor<T>): SourceType<T> {
    return new Type(t.name, matches(t.name, value => value instanceof t));
}

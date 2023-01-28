import {SourceType, Type} from '../type';
import {matches} from '../internal/matches';

interface TypeConstructor<T> extends Function {
    new(...args: any[]): T;
}

export function unknown(): SourceType<unknown> {
    return new Type('unknown', value => value);
}

export function any(): Type<any, any> {
    return new Type('any', () => null);
}

export function string(): SourceType<string> {
    return new Type('string', matches('string', t => typeof t === 'string'));
}

export function boolean(): SourceType<boolean> {
    return new Type('boolean', matches('boolean', t => typeof t === 'boolean'));
}

export function number(): SourceType<number> {
    return new Type(`number`, matches('number', t => typeof t === 'number'));
}

export function literal<K extends string | null | undefined | number | boolean>(lit: K): Type<K, K> {
    return new Type(JSON.stringify(lit), matches(`literal '${lit}'`, t => t === lit));
}

export function nullValue(): Type<null, null> {
    return literal(null);
}

export function undefinedValue(): Type<undefined, undefined> {
    return literal(undefined);
}

export function instanceOf<T>(t: TypeConstructor<T>): Type<T, T> {
    return new Type(t.name, matches(t.name, value => value instanceof t));
}

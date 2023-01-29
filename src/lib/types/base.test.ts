import {literal, number, string} from './base';
import {InvalidValue} from '../invalid-value';
import {TypeOf} from '../type';
import {IsAssignable, IsNotAssignable, typeAssert} from '../internal/asserts';

describe('basic types', () => {
    test('string should accept all kinds of string', () => {
        expect(string().parseSafe('foo')).toEqual('foo');
        expect(string().parseSafe('null')).toEqual('null');
        expect(string().parseSafe('undefined')).toEqual('undefined');
        expect(string().parseSafe('')).toEqual('');
    });

    test('number should accept all kinds of numbers', () => {
        expect(number().parseSafe(123)).toEqual(123);
        expect(number().parseSafe(0)).toEqual(0);
        expect(number().parseSafe(-1)).toEqual(-1);
        expect(number().parseSafe(Number.NaN)).toBeNaN();
        expect(number().parseSafe(Number.POSITIVE_INFINITY)).toEqual(Number.POSITIVE_INFINITY);
    });

    test('string should not accept other types', () => {
        expect(string().parseSafe(null as any)).toBeInstanceOf(InvalidValue);
        expect(string().parseSafe(123 as any)).toBeInstanceOf(InvalidValue);
        expect(string().parseSafe(undefined as any)).toBeInstanceOf(InvalidValue);

        const tString = string();
        type String = TypeOf<typeof tString>;
        typeAssert<IsAssignable<String, 'foo'>>();
        typeAssert<IsAssignable<String, string>>();
        typeAssert<IsNotAssignable<String, number>>();
        typeAssert<IsNotAssignable<String, null>>();
    });
});


describe('literals', () => {
    test('should not confuse null and undefined ', () => {
        expect(literal(null).parseSafe(null)).toEqual(null);
        expect(literal(undefined).parseSafe(undefined)).toEqual(undefined);
        expect(literal(0).parseSafe(0)).toEqual(0);

        expect(literal(null).parseSafe(undefined)).toBeInstanceOf(InvalidValue);
        expect(literal(null).parseSafe(0)).toBeInstanceOf(InvalidValue);
        expect(literal(undefined).parseSafe(null)).toBeInstanceOf(InvalidValue);
        expect(literal(undefined).parseSafe(0)).toBeInstanceOf(InvalidValue);
        expect(literal(0).parseSafe(null)).toBeInstanceOf(InvalidValue);
        expect(literal(0).parseSafe(undefined)).toBeInstanceOf(InvalidValue);
    });

    test('should work with simple literals', () => {
        expect(literal('foo').parseSafe('foo')).toEqual('foo');
        expect(literal(1).parseSafe(1)).toEqual(1);
        expect(literal(true).parseSafe(true)).toEqual(true);
        expect(literal(false).parseSafe(false)).toEqual(false);

        const tFoo = literal('foo');
        type Foo = TypeOf<typeof tFoo>;
        typeAssert<IsAssignable<Foo, 'foo'>>();
        typeAssert<IsNotAssignable<Foo, 'foo-x'>>();
    });
});

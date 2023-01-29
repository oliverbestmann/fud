import {union} from './union';
import {literal, number, string} from './base';
import {InvalidValue} from '../invalid-value';
import {SourceOf, TypeOf} from '../type';
import {IsAssignable, IsNotAssignable, typeAssert} from '../internal/asserts';
import {toUpperCase} from '../transforms';


describe('union types', () => {
    test('should parse the right types', () => {
        const zStringNumber = union(string(), number());

        expect(zStringNumber.parseSafe(1)).toEqual(1);
        expect(zStringNumber.parseSafe('foo')).toEqual('foo');
        expect(zStringNumber.parseSafe(null)).toBeInstanceOf(InvalidValue);
    });

    test('should derive the right typings', () => {
        const zStringNumber = union(string(), number());
        type StringNumber = TypeOf<typeof zStringNumber>;

        typeAssert<IsAssignable<StringNumber, number>>();
        typeAssert<IsAssignable<StringNumber, 1>>();
        typeAssert<IsAssignable<StringNumber, string>>();
        typeAssert<IsAssignable<StringNumber, 'foo'>>();

        typeAssert<IsNotAssignable<StringNumber, object>>();
        typeAssert<IsNotAssignable<StringNumber, string[]>>();
        typeAssert<IsNotAssignable<StringNumber, unknown>>();
    });

    test('should derive the right source type', () => {
        const zStringNumber = union(number(), literal('foo').pipe(toUpperCase()));
        type StringNumber = SourceOf<typeof zStringNumber>;

        typeAssert<IsAssignable<StringNumber, number>>();
        typeAssert<IsAssignable<StringNumber, 1>>();
        typeAssert<IsAssignable<StringNumber, 'foo'>>();

        typeAssert<IsNotAssignable<StringNumber, string>>();
        typeAssert<IsNotAssignable<StringNumber, object>>();
        typeAssert<IsNotAssignable<StringNumber, string[]>>();
        typeAssert<IsNotAssignable<StringNumber, unknown>>();
    });
});

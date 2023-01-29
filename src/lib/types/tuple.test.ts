import {number, string} from './base';
import {InvalidValue} from '../invalid-value';
import {TypeOf} from '../type';
import {IsAssignable, IsNotAssignable, typeAssert} from '../internal/asserts';
import {tuple} from './tuple';


describe('tuple types', () => {
    test('should parse the right types', () => {
        const fPoint = tuple(number(), number());

        expect(fPoint.parseSafe([1, 2])).toEqual([1, 2]);
        expect(fPoint.parseSafe([0, -3])).toEqual([0, -3]);
        expect(fPoint.parseSafe([])).toBeInstanceOf(InvalidValue);
        expect(fPoint.parseSafe([1])).toBeInstanceOf(InvalidValue);
        expect(fPoint.parseSafe([1, null])).toBeInstanceOf(InvalidValue);
        expect(fPoint.parseSafe([1, 2, 3])).toBeInstanceOf(InvalidValue);
    });

    test('should derive the right typings', () => {
        const fType = tuple(number(), string());
        type TheType = TypeOf<typeof fType>;

        typeAssert<IsAssignable<TheType, [number, string]>>();
        typeAssert<IsAssignable<TheType, [123, string]>>();

        typeAssert<IsNotAssignable<TheType, (number | string)[]>>();
        typeAssert<IsNotAssignable<TheType, [string, number]>>();
        typeAssert<IsNotAssignable<TheType, [number]>>();
        typeAssert<IsNotAssignable<TheType, [string]>>();
        typeAssert<IsNotAssignable<TheType, [number, string, string]>>();
    });
});

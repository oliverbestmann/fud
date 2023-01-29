import {Type, TypeTransform} from './type';
import {InvalidValue, isInvalidValue} from './invalid-value';

/**
 * Transforms the value of type T into a value of type Out.
 *
 * A transformation might parse a string into a date or number, creates an instance of some custom types,
 * perform base64 deserializing, etc.
 */
export function transform<Out, T, Source>(mapper: (value: T) => Out | InvalidValue): TypeTransform<Out, T, Source> {
    return type => new Type(type.name, value => {
            const valueT = type.transformValue(value);
            return isInvalidValue(valueT) ? valueT : mapper(valueT);
        },
    );
}

/**
 * A convenience wrapper for `transform` to verify that a value matches a given predicate. If the value
 * matches the predicate, it will be returned unchanged. Otherwise an InvalidValue will be created using
 * the provided message.
 */
export function validate<T, Source>(message: string, pred: (value: T) => boolean): TypeTransform<T, T, Source> {
    return transform(value => pred(value) ? value : new InvalidValue(message, value));
}

/**
 * Applies string.toLowerCase() to the input string.
 */
export function toLowerCase<Source>(): TypeTransform<string, string, Source> {
    return transform(value => value.toLowerCase());
}

/**
 * Applies string.toUpperCase() to the input string.
 */
export function toUpperCase<Source>(): TypeTransform<string, string, Source> {
    return transform(value => value.toUpperCase());
}

/**
 * Applies toString() to the input value.
 */
export function toString<Source>(): TypeTransform<string, unknown, Source> {
    return transform(value => String(value));
}

/**
 * Parses the input into a date. If the resulting date is invalid, this transformation will produce
 * an InvalidValue error and fail parsing.
 */
export function toDate<Source>(): TypeTransform<Date, string | number | Date, Source> {
    return transform(value => {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getDate()) ? new InvalidValue('invalid date', value) : parsed;
    });
}

/**
 * Validates that the input number has at least the given minimum value.
 */
export function isAtLeast<T extends number, Source>(minValue: number): TypeTransform<T, T, Source> {
    return validate(`value >= ${minValue}`, n => n >= minValue);
}

/**
 * Validates that the input number has at least the given maximum value.
 */
export function isAtMost<T extends number, Source>(maxValue: number): TypeTransform<T, T, Source> {
    return validate(`value <= ${maxValue}`, n => n <= maxValue);
}

/**
 * Verifies that the input matches the regular expression.
 */
export function regex<Source>(r: RegExp): TypeTransform<string, string, Source> {
    return validate('matches ' + r.source, value => r.test(value));
}

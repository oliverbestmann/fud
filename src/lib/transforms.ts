import {Type, TypeTransform} from './type';
import {InvalidValue, isInvalidValue} from './invalid-value';

export function transform<Out, T, Source>(mapper: (value: T) => Out | InvalidValue): TypeTransform<Out, T, Source> {
    return type => new Type(type.name, value => {
            const valueT = type.transformValue(value);
            return isInvalidValue(valueT) ? valueT : mapper(valueT);
        },
    );
}

export function validate<T, Source>(message: string, pred: (value: T) => boolean): TypeTransform<T, T, Source> {
    return transform(value => pred(value) ? value : new InvalidValue(message, value));
}

export function toLowerCase<Source>(): TypeTransform<string, string, Source> {
    return transform(value => value.toLowerCase());
}

export function toUpperCase<Source>(): TypeTransform<string, string, Source> {
    return transform(value => value.toUpperCase());
}

export function toString<Source>(): TypeTransform<string, unknown, Source> {
    return transform(value => String(value));
}

export function toDate<Source>(): TypeTransform<Date, string | number | Date, Source> {
    return transform(value => new Date(value));
}

export function min<T extends number, Source>(minValue: number): TypeTransform<T, T, Source> {
    return validate(`value >= ${minValue}`, n => n >= minValue);
}

export function max<T extends number, Source>(maxValue: number): TypeTransform<T, T, Source> {
    return validate(`value <= ${maxValue}`, n => n <= maxValue);
}

export function regex<Source>(r: RegExp): TypeTransform<string, string, Source> {
    return validate('matches ' + r.source, value => r.test(value));
}

import {ValueTransform} from '../type';
import {InvalidValue} from '../invalid-value';

export function matches<T>(message: string, pred: (value: unknown) => boolean): ValueTransform<T, T> {
    return value => pred(value) ? value as T : new InvalidValue('failed: ' + message, value);
}

import {Type} from '../type';
import {InvalidValue, isInvalidValue} from '../../index';
/*
type TypesOf<T extends unknown[]> = { [K in keyof T]: T[K] extends Type<infer Ty, infer S> ? Ty : never }[number];
type SourcesOf<T extends unknown[]> = { [K in keyof T]: T[K] extends Type<infer Ty, infer S> ? S : never }[number];
*/

type TypesOf<T extends unknown> = { [K in keyof T]: T[K] extends Type<infer Ty, infer S> ? Ty : never };
type SourcesOf<T extends unknown> = { [K in keyof T]: T[K] extends Type<infer Ty, infer S> ? S : never };

/**
 * Creates an tuple type containing a specific sequence of types
 */
export function tuple<E extends Type<any, any>[]>(...elements: E): Type<TypesOf<E>, SourcesOf<E>> {
    const name = '[' + elements.map(el => el.name).join(', ') + ']';

    return new Type(name, values => {
        if (!Array.isArray(values)) {
            return new InvalidValue('expected array', values);
        }

        if (values.length !== elements.length) {
            return new InvalidValue(`expected ${elements.length} values, got ${values.length}`, values);
        }

        // @ts-expect-error
        const result: TypesOf<E> = new Array(elements.length);

        for (let idx = 0; idx < elements.length; idx++) {
            const value = elements[idx].transformValue(values[idx]);
            if (isInvalidValue(value)) {
                return value.pathComponent(idx.toString());
            }

            result[idx] = value;
        }

        return result;
    });
}

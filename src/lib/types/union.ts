import {Type} from '../type';
import {InvalidValue, isInvalidValue} from '../invalid-value';

type TypesOf<T extends unknown[]> = { [K in keyof T]: T[K] extends Type<infer Ty, infer S> ? Ty : never }[number];
type SourcesOf<T extends unknown[]> = { [K in keyof T]: T[K] extends Type<infer Ty, infer S> ? S : never }[number];

/**
 * Models a union of multiple types.
 */
export function union<Types extends Type<any, any>[]>(...types: Types): Type<TypesOf<Types>, SourcesOf<Types>> {
    if (types.length === 0) {
        const err = () => new InvalidValue('no value', undefined);
        return new Type<never, unknown>('never', err);
    }

    const name = types.map(m => m.name).join(' | ');

    return new Type(name, value => {
            for (const type of types.slice(1)) {
                const res = type.transformValue(value);
                if (!isInvalidValue(res)) {
                    return res;
                }
            }

            return types[0].transformValue(value);
        },
    );
}

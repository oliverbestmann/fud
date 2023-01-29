import {Type, ValueTransform} from '../type';
import {InvalidValue, isInvalidValue} from '../invalid-value';

export class ObjectType<T extends object, Source> extends Type<T, Source> {
    constructor(name: string, transform: ValueTransform<T, Source>) {
        super(name, transform);
    }
}

type TypesOf<T extends object> = {
    [K in keyof T]: (T[K] extends Type<infer Ty, infer Source> ? Ty : never)
}

type SourcesOf<T extends object> = {
    [K in keyof T]: (T[K] extends Type<infer Ty, infer Source> ? Source : never)
}

/**
 * Creates an object type.
 */
export function object<T extends object>(shape: T): ObjectType<TypesOf<T>, SourcesOf<T>> {
    const transform = (value: any) => {
        if (value == null) {
            return new InvalidValue('is null', value);
        }

        if (value.constructor !== Object) {
            return new InvalidValue('is not an object', value);
        }

        const result: Record<string, unknown> = {};
        for (const [key, type] of Object.entries(shape)) {
            const transformed = type.transformValue(value[key]);
            if (isInvalidValue(transformed)) {
                return transformed.pathComponent(key);
            }

            result[key] = transformed;
        }

        return result;
    };

    const shapeStr = Object.entries(shape)
        .map(([key, type]) => `${key}: ${type.name}`)
        .join(', ');

    const name = `{${shapeStr}}`;

    return new ObjectType(name, transform) as any;
}

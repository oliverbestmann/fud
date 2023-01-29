import {InvalidValue, isInvalidValue} from './invalid-value';

/**
 * A transform that transform a `Type` from `Type<In, Source>` to `Type<Out, Source>`.
 */
export type TypeTransform<
    Out, In, Source,
    //OutType extends Type<Out, Source> = Type<Out, Source>,
    //InType extends Type<In, Source> = Type<In, Source>,
> = {
    (type: Type<In, Source>): Type<Out, Source>
};

/**
 * Transforms a value from type `In` into type `Out`. If transformation fails or is invalid,
 * the function is required to return an `InvalidValue` instance describing the issue
 */
export type ValueTransform<Out, In> = (value: In) => Out | InvalidValue;

/**
 * Extracts the output type T of a `Type<T, Source>` type.
 */
export type TypeOf<TypeT> = TypeT extends Type<infer T, any> ? T : never;

/**
 * Extracts the source type of `Type<T, Source>` type.
 */
export type SourceOf<TypeT> = TypeT extends Type<any, infer Source> ? Source : never;

/**
 * Alias for Type<T, T>.
 * This describes an untransformed source type, such as returned by `string()`
 */
export type SourceType<T> = Type<T, T>;

/**
 * Type as a current type T, as well as an source type Source, that tracks the actual
 * source type that this type can parse into type T
 */
export class Type<T, Source> {
    constructor(
        readonly name: string,
        readonly transformValue: ValueTransform<T, Source>,
    ) {
    }

    /**
     * Applies a sequence of type transformations to this type. While a transformation might
     * change the target type, it will always preserve the Source type of the input type.
     */
    public pipe<Out>(a: TypeTransform<Out, T, Source>): Type<Out, Source>
    public pipe<Out, A>(a: TypeTransform<A, T, Source>, b: TypeTransform<Out, A, Source>): Type<Out, Source>
    public pipe<Out, A, B>(a: TypeTransform<A, T, Source>, b: TypeTransform<B, A, Source>, c: TypeTransform<Out, B, Source>): Type<Out, Source>
    public pipe<Out, A, B, C>(a: TypeTransform<A, T, Source>, b: TypeTransform<B, A, Source>, c: TypeTransform<C, B, Source>, d: TypeTransform<Out, B, Source>): Type<Out, Source>
    pipe(...transforms: TypeTransform<any, any, Source>[]): Type<any, Source> {
        let result: Type<unknown, any> = this;
        for (const transform of transforms) {
            result = transform(result);
        }

        return result;
    }

    /**
     * Parses the given input into the target type. If parsing fails,
     * this method will return an instance of InvalidValue.
     */
    public parseSafe(value: unknown): T | InvalidValue {
        return this.transformValue(value as Source);
    }

    /**
     * Parses the input into the target type. If parsing fails this method
     * will throw an Error exception.
     */
    public parse(value: unknown): T {
        const res = this.parseSafe(value);
        if (isInvalidValue(res)) {
            throw new Error(res.toString());
        }

        return res;
    }

    /**
     * Parses the given input into the target type. If parsing fails this method
     * will return null. If the target type is nullable, this might lead to confusion
     * In that case, it might be better to use `parseSafe`.
     */
    public parseOrNull(value: unknown): T | null {
        const res = this.parseSafe(value);
        return isInvalidValue(res) ? null : res;
    }
}

/**
 * Makes a type optional. A optional type is either null, undefined or matches the type T.
 * null and undefined are both kept unchanged.
 */
export function optional<T, Source>(type: Type<T, Source>): Type<T | undefined | null, Source | undefined | null> {
    return new Type(type.name + ' | undefined | null', value => {
        return value == null
            ? value as (undefined | null)
            : type.transformValue(value);
    });
}

/**
 * Makes a type nullable. A nullable type is either null or matches the type T.
 * An undefined input value is conveniently mapped to null.
 */
export function nullable<T, Source>(type: Type<T, Source>): Type<T | null, Source | null> {
    return new Type(type.name + ' | null', value => {
        return value == null ? null : type.transformValue(value);
    });
}

/**
 * Defers type creation. Useful for recursive types.
 */
export function defer<T, Source>(name: string, typeConstructor: () => Type<T, Source>): Type<T, Source> {
    let cachedType: Type<T, Source> | null = null;

    const type = (): Type<T, Source> => {
        if (cachedType == null) {
            cachedType = typeConstructor();
        }

        return cachedType;
    };

    return new Type(`defer<${name}>`, value => type().transformValue(value));
}

/**
 * Marks an invalid value. We use this instead of exceptions.
 */
export class InvalidValue {
    readonly path: string[] = [];

    constructor(
        readonly message: string,
        readonly value: unknown,
    ) {
    }

    /**
     * Adds a component to the path to the invalid value.
     */
    pathComponent(pathComponent: string): this {
        this.path.unshift(pathComponent);
        return this;
    }

    /**
     * Converts the instance into a descriptive error message.
     */
    toString(): string {
        const pathStr = ['$', ...this.path].join('.');
        return `Error '${this.message}' at '${pathStr}', got value: ${this.value}`;
    }
}

/**
 * Identifies a value as an instance of `InvalidValue`.
 */
export function isInvalidValue(value: unknown): value is InvalidValue {
    return value instanceof InvalidValue;
}

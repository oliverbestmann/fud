import {Type} from '../type';
import {matches} from '../internal/matches';
import {isInvalidValue, transform} from '../../index';

/**
 * Creates an array type containing homogeneous elements.
 */
export function array<T, Source>(elementType: Type<T, Source>): Type<T[], Source[]> {
    const every = transform<T[], Source[], Source[]>(value => {
        const result: T[] = new Array(value.length);

        for (let idx = 0; idx < value.length; idx++) {
            const element = elementType.transformValue(value[idx]);
            if (isInvalidValue(element)) {
                return element.pathComponent(idx.toString());
            }

            result[idx] = element;
        }

        return result;
    });

    // start with an array
    const array = new Type<Source[], Source[]>(
        elementType.name + '[]',
        matches('array', t => Array.isArray(t)),
    );

    // and validate every element
    return array.pipe(every);
}

import {Type} from '../type';
import {matches} from '../internal/matches';
import {isInvalidValue, transform} from '../../index';

export function array<T, Source>(elementType: Type<T, Source>): Type<T[], Source[]> {
    const every = transform<T[], Source[], Source[]>(value => {
        const result: T[] = [];
        for (let i = 0; i < value.length; i++) {
            const element = elementType.transformValue(value[i]);
            if (isInvalidValue(element)) {
                return element.pathComponent(i.toString());
            }

            result.push(element);
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

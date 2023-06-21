import {Type} from '../type';
import {matches} from '../internal/matches';
import {isInvalidValue, transform} from '../../index';


type Mapping<K extends string, V> = { [k: string]: V; };

/**
 * Creates an array type containing homogeneous elements.
 */
export function record<K extends string, V, KSource extends string, VSource>(
    keyType: Type<K, KSource>,
    valueType: Type<V, VSource>,
): Type<Mapping<K, V>, Mapping<KSource, VSource>> {

    const every = transform<Mapping<K, V>, Mapping<KSource, VSource>, Mapping<KSource, VSource>>(value => {
        const entries = Object.entries(value);
        const result: [K, V][] = new Array(entries.length);

        for (let idx = 0; idx < entries.length; idx++) {
            const [key, value] = entries[idx];

            const keyTransformed = keyType.parseSafe(key);
            if (isInvalidValue(keyTransformed)) {
                return keyTransformed.pathComponent(`key(${key})`);
            }

            const valueTransformed = valueType.parseSafe(value);
            if (isInvalidValue(valueTransformed)) {
                return valueTransformed.pathComponent(key);
            }

            result[idx] = [keyTransformed, valueTransformed];
        }

        return Object.fromEntries(result);
    });

    const object = new Type<Mapping<KSource, VSource>, Mapping<KSource, VSource>>(
        `{ [key: ${keyType.name}]: ${valueType.name} }`,
        matches('record', t => typeof t === 'object'),
    );

    // and validate every element
    return object.pipe(every);
}

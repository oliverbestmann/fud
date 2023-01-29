import {number, string} from './base';
import {SourceOf, TypeOf} from '../type';
import {toDate} from '../transforms';
import {object} from './object';


describe('object type', () => {
    test('should parse the right types', () => {
        const personType = object({
            age: number(),
            name: string(),
            birth: string().pipe(toDate()),
        });

        expect(personType.parseSafe({age: 35, name: 'Foo', birth: '2023-01-29T14:53:35.408Z'})).toEqual({
            age: 35,
            name: 'Foo',
            birth: new Date('2023-01-29T14:53:35.408Z'),
        });
    });

    test('should derive the right typings', () => {
        const personType = object({
            age: number(),
            name: string(),
            birth: string().pipe(toDate()),
        });

        type P = TypeOf<typeof personType>;
        const p = {} as P;

        // just for type checking
        p.age?.toFixed();
        p.name?.toUpperCase();
        p.birth?.getTime();

        type S = SourceOf<typeof personType>;
        const s = {} as S;

        // just for type checking
        s.age?.toFixed();
        s.name?.toUpperCase();
        s.birth?.toUpperCase();
    });
});

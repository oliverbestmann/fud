import {any, instanceOf, literal, number, string} from './lib/types/base';
import {defer, nullable, SourceOf, Type, TypeOf} from './lib/type';
import {array} from './lib/types/array';
import {max, min, toDate, toString, toUpperCase} from './lib/transforms';
import {union} from './lib/types/union';
import {object} from './lib/types/object';

export * from './lib/invalid-value';
export * from './lib/type';
export * from './lib/transforms';

export * from './lib/types/base';
export * from './lib/types/object';
export * from './lib/types/array';
export * from './lib/types/union';

// Validation

// noinspection JSUnusedLocalSymbols
function test() {
    const tString = string();
    const tNumber = number();
    const tLitFoo = literal('foo');
    const tLit123 = literal(123);

    const tNumberOrString = union(tNumber, tLitFoo.pipe(toUpperCase()));

    const tArray = array(tNumberOrString);

    const tObjectSimple = object({
        type: literal('person').pipe(toUpperCase()),
        age: number(),
        name: string(),
    });

    const x: TypeOf<typeof tObjectSimple> = {
        type: 'Person',
        name: 'foo',
        age: 123,
    };

    const zPerson = object({
        type: literal('person'),
        name: nullable(string()),
        birthday: string().pipe(toDate()),
        age: union(
            number().pipe(toString()),
            literal('dead'),
        ),
    });

    const p1: TypeOf<typeof zPerson> = {} as any;
    const p2: SourceOf<typeof zPerson> = {} as any;


    const zCompany = object({
        type: literal('company'),
        stock: string().pipe(toUpperCase()),
        employees: number().pipe(min(1), max(100)),
        locations: array(string()),
        // point: tuple(number(), string()),
        founded: instanceOf(Date),
    });

    type Node = {
        value: any,
        next: Node | null,
    }

    const zNode: Type<Node, Node> = object({
        value: any(),
        next: nullable(defer('Node', () => zNode)),
    });
}


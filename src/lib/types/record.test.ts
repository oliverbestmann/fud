import {number, string} from './base';
import {record} from './record';


describe('record type', () => {
    test('should parse a valid record', () => {
        const tags = record(string(), number());

        expect(tags.parseSafe({age: 35, year: 1987})).toEqual({
            age: 35,
            year: 1987,
        });
    });
});

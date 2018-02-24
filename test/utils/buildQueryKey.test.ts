import { buildQueryKey } from '../../src/utils/buildQueryKey';

describe('Utils', () => {
  describe('buildQueryKey', () => {
    const testQuery = () => { return; };

    it('return query name if props provided', () => {
      expect(buildQueryKey(testQuery)).toBe('testQuery');
    });

    it('return key build from query name and stringified props', () => {
      const props = {
        a: 1,
        b: 'b prop',
        c: () => { return; },
        d: new Map()
      };

      expect(buildQueryKey(testQuery, props)).toBe('testQuery:{"a":1,"b":"b prop","d":{}}');
    });
  });
});

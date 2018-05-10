import { buildQueryKey } from '../../src/utils/buildQueryKey';

describe('Utils', () => {
  describe('buildQueryKey', () => {
    const testQuery = () => {
      return;
    };

    it('returns query name and query prop if no props provided', () => {
      expect(buildQueryKey(testQuery)).toBe('testQuery[65b876fd4521ead1f877ff5b830355f2]');
    });

    it('returns key build from query name and stringified props', () => {
      const props = {
        a: 1,
        b: 'b prop',
        c: () => {
          return;
        },
        d: new Map()
      };

      expect(buildQueryKey(testQuery, props)).toBe(
        'testQuery[65b876fd4521ead1f877ff5b830355f2]:{"a":1,"b":"b prop","d":{}}'
      );
    });
  });

  describe('anonymous queries', () => {
    const props = {
      a: 1,
      b: 'b prop',
      c: () => {
        return;
      },
      d: new Map()
    };

    it('returns md5 hashed query with anonymous identifier', () => {
      const queryKeyA = buildQueryKey(() => {});
      const queryKeyB = buildQueryKey(() => {});
      const queryKeyC = buildQueryKey(() => {}, props);
      const queryKeyD = buildQueryKey((a: string) => {});

      expect(queryKeyA).toContain('anonymous');
      expect(queryKeyB).toContain('anonymous');
      expect(queryKeyC).toContain('anonymous');
      expect(queryKeyD).toContain('anonymous');

      expect(queryKeyA).toEqual(queryKeyB);
      expect(queryKeyA).not.toEqual(queryKeyC);
      expect(queryKeyA).not.toEqual(queryKeyD);
    });
  });
});

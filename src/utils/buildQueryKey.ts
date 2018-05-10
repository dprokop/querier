import md5 from 'js-md5';

// tslint:disable-next-line
export const buildQueryKey = (query: Function, props?: any) => {
  const queryKey = `${query.name || 'anonymous'}[${md5(query.toString())}]`;
  return props ? `${queryKey}:${JSON.stringify(props)}` : queryKey;
};

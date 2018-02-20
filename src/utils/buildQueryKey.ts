// tslint:disable-next-line
const buildQueryKey = (query: Function, props?: any) => {
  if (props) {
    return `${query.name}:${JSON.stringify(props)}`;
  } else {
    return `${query.name}`;
  }
};

export default buildQueryKey;

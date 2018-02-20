class QuerierLogger {
  // tslint:disable-next-line
  private logs: Array<any> = [];

  public log(label: string, data?: {}) {
    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed('Querier: ' + label);
      // tslint:disable-next-line
      console.info(data);
      console.groupEnd();
    }
  }
}

export default QuerierLogger;

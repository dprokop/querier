import * as React from 'react';
import Querier from './Querier';
import { QuerierType } from './types';

export interface QuerierProviderContext {
  querier: QuerierType;
}

export interface QuerierProviderProps {
  children: JSX.Element;
  querier?: QuerierType;
}

export class QuerierProvider extends React.Component<QuerierProviderProps, {}> {
  static childContextTypes = {
    querier: Querier
  };

  private querier: QuerierType;

  constructor(props: QuerierProviderProps) {
    super(props);
    this.querier = props.querier || new Querier();
  }

  getChildContext(): QuerierProviderContext {
    return {
      querier: this.querier
    };
  }

  render() {
    return this.props.children;
  }
}

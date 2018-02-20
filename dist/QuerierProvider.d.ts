/// <reference types="react" />
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
export declare class QuerierProvider extends React.Component<QuerierProviderProps, {}> {
    static childContextTypes: {
        querier: typeof Querier;
    };
    private querier;
    constructor(props: QuerierProviderProps);
    getChildContext(): QuerierProviderContext;
    render(): JSX.Element | (string & JSX.Element) | (number & JSX.Element) | (true & JSX.Element) | (false & JSX.Element) | (React.ReactElement<any> & JSX.Element) | ((string | number | boolean | any[] | React.ReactElement<any>)[] & JSX.Element) | (React.ReactPortal & JSX.Element);
}

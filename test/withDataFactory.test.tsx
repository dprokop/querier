import * as PropTypes from 'prop-types';
import React from 'react';
import { QuerierType, WithDataProps } from '../src/types';
import { withDataFactory } from '../src/withDataFactory';
import Querier, { WrappedInputQueries } from '../src';
import { mount } from 'enzyme';

class Child extends React.Component<{}, {}> {
  static contextTypes = {
    querier: PropTypes.object
  };

  render() {
    return <div>Chillld</div>;
  }
}

class QuerierProviderMock extends React.Component<{
  querier: QuerierType;
}> {
  static childContextTypes = {
    querier: PropTypes.object
  };

  getChildContext() {
    return {
      querier: this.props.querier
    };
  }

  render() {
    return this.props.children;
  }
}

const spiedQuery = (spy?: Function) => {
  return async (...args) => {
    if (spy) {
      spy(...args);
    }
    return 'result';
  };
};

const mockWrappedQuery = (name, query, resultActions, hot, key) => {
  const wrappedQueryMock = {};
  wrappedQueryMock[name] = {
    query,
    resultActions,
    hot,
    key
  };

  return wrappedQueryMock as WrappedInputQueries<ComponentProps, ComponentInputQueries>;
};

type ComponentProps = {
  prop1?: string;
};

type ComponentInputQueries = {
  test: string;
};

type ComponentActionQueries = {
  actionQueryTest: string;
};

class Component extends React.Component<
  WithDataProps<ComponentProps, ComponentInputQueries, ComponentActionQueries>,
  {}
> {
  render() {
    return <div />;
  }
}

class Container extends React.Component<
  ComponentProps & {
    children: (props: ComponentProps) => JSX.Element;
  }
> {
  render() {
    const { children, ...otherProps } = this.props;
    return this.props.children(otherProps);
  }
}

describe('withDataFactory', () => {
  it('executes input queries on mount', () => {
    const querySpy = jest.fn();
    const query = spiedQuery(querySpy);
    const inputQueries = mockWrappedQuery('test', query, null, false, 'queryKey');

    const ComponentWithData = withDataFactory<ComponentProps, ComponentInputQueries, {}>({
      inputQueries
    })(Component);

    const wrapper = mount(
      <QuerierProviderMock querier={new Querier()}>
        <ComponentWithData />
      </QuerierProviderMock>
    );

    expect(querySpy).toBeCalled();
    expect(querySpy.mock.calls).toHaveLength(1);
  });

  it('passes component props to input query', () => {
    const querySpy = jest.fn();
    const query = spiedQuery(querySpy);
    const inputQueries = mockWrappedQuery('test', query, null, false, 'queryKey');

    const ComponentWithData = withDataFactory<ComponentProps, ComponentInputQueries, {}>({
      inputQueries
    })(Component);

    const wrapper = mount(
      <QuerierProviderMock querier={new Querier()}>
        <ComponentWithData prop1="yay" />
      </QuerierProviderMock>
    );

    expect(querySpy).toBeCalled();
    expect(querySpy).toBeCalledWith({
      prop1: 'yay'
    });
    expect(querySpy.mock.calls).toHaveLength(1);
  });

  it('executes input queries on props change', () => {
    const querySpy = jest.fn();
    const query = spiedQuery(querySpy);

    const inputQueries = mockWrappedQuery('test', query, null, false, 'queryKey');

    const ComponentWithData = withDataFactory<ComponentProps, ComponentInputQueries, {}>({
      inputQueries
    })(Component);

    const wrapper = mount(
      <Container prop1="yay">
        {({ prop1 }) => {
          return (
            <QuerierProviderMock querier={new Querier()}>
              <ComponentWithData prop1={prop1} />
            </QuerierProviderMock>
          );
        }}
      </Container>
    );

    wrapper.setProps({ prop1: 'wow' });

    expect(querySpy.mock.calls).toHaveLength(2);
    expect(querySpy).toBeCalledWith({ prop1: 'yay' });
    expect(querySpy).toBeCalledWith({ prop1: 'wow' });
  });

  it('passes results and states to component', () => {
    const query = spiedQuery();
    const inputQueries = mockWrappedQuery('test', query, null, false, 'queryKey');

    const ComponentWithData = withDataFactory<ComponentProps, ComponentInputQueries, {}>({
      inputQueries
    })(Component);

    const querier = new Querier({
      'queryKey:{"prop1":"yay"}': {
        id: 'queryKey:{"prop1":"yay"}',
        result: 'result',
        state: { state: 2 },
        $props: { prop1: 'yay' },
        $reason: 'Component'
      }
    });

    const wrapper = mount(
      <QuerierProviderMock querier={querier}>
        <ComponentWithData prop1="yay" />
      </QuerierProviderMock>
    );

    const component = wrapper.find(Component);

    expect(component.props().results).toEqual({
      test: 'result'
    });
    expect(component.props().states).toEqual({
      test: { state: 2 }
    });
    expect(component.props().actionQueries).toEqual({});
  });

  it('passes wrapped action queries to component', async () => {
    const querySpy = jest.fn();
    const query = spiedQuery(querySpy);
    const actionQueries = mockWrappedQuery('actionQueryTest', query, null, false, 'queryKey');

    const ComponentWithData = withDataFactory<ComponentProps, {}, ComponentActionQueries>({
      actionQueries: {
        actionQueryTest: {
          query,
          resultActions: null,
          hot: false,
          key: ''
        }
      }
    })(Component);

    const wrapper = mount(
      <QuerierProviderMock querier={new Querier()}>
        <ComponentWithData prop1="yay" />
      </QuerierProviderMock>
    );

    expect(querySpy).not.toBeCalled();
    expect(wrapper.find(Component).props().actionQueries).toHaveProperty('actionQueryTest');
    await wrapper.find(Component).props().actionQueries.actionQueryTest();
    expect(querySpy).toBeCalled();

  });

  it('handles pure function components', () => {
    const querySpy = jest.fn();
    const renderSpy = jest.fn();
    const query = spiedQuery(querySpy);

    const inputQueries = mockWrappedQuery('test', query, null, false, 'queryKey');

    const FunctionalComponent = (props: WithDataProps<ComponentProps, ComponentInputQueries, {}>) => {
      renderSpy();
      return <div />;
    };

    const FunctionalComponentWithData = withDataFactory<ComponentProps, ComponentInputQueries, {}>({
      inputQueries
    })(FunctionalComponent);

    const wrapper = mount(
      <QuerierProviderMock querier={new Querier()}>
        <FunctionalComponentWithData prop1="yay" />
      </QuerierProviderMock>
    );

    expect(renderSpy).toBeCalled();
  });

  it('unsubscribes from Querier on unmount', () => {
    const query = spiedQuery();
    const inputQueries = mockWrappedQuery('test', query, null, false, 'queryKey');

    const ComponentWithData = withDataFactory<ComponentProps, ComponentInputQueries, {}>({
      inputQueries
    })(Component);

    const querier = new Querier();

    const wrapper = mount(
      <Container prop1="yay">
        {({ prop1 }) => {
          return (
            <QuerierProviderMock querier={querier}>
              {prop1 === 'yay' ? <ComponentWithData prop1={prop1} /> : null}
            </QuerierProviderMock>
          );
        }}
      </Container>
    );

    expect(querier.getListeners().size).toBe(1);
    wrapper.setProps({prop1: 'nay'}); // will cause ComponentWithData to unmount
    expect(querier.getListeners().size).toBe(0);
  });
});

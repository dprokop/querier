import * as React from 'react';
import { mount } from 'enzyme';
import Querier, { QuerierProvider } from '../src';
import * as PropTypes from 'prop-types';

const childrenRenderSpy = jest.fn();

class Child extends React.Component<{}, {}> {
  static contextTypes = {
    querier: PropTypes.object
  };

  render() {
    childrenRenderSpy(this.context.querier);
    return <div>Chillld</div>;
  }

}

describe('QuerierProvider', () => {
  it('adds querier to child context', () => {
    const querier = new Querier();
    const component = (
      <QuerierProvider querier={querier}>
        <Child/>
      </QuerierProvider>
    );
    const wrapper = mount(component);
    const renderedChild = wrapper.find(Child);
    expect(childrenRenderSpy).toHaveBeenCalledWith(querier);
  });
});

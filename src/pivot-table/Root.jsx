import ReactDOM from 'react-dom';
import React from 'react';
import PivotTable from './components/PivotTable';

export function render(rootElement, props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  ReactDOM.render(<PivotTable {...props} />, rootElement);
}

export function teardown(rootElement) {
  ReactDOM.unmountComponentAtNode(rootElement);
}

import ReactDOM from 'react-dom';
import React from 'react';
import PivotTable from './components/pivot-table';

export function render(rootElement) {
  ReactDOM.render(<PivotTable />, rootElement);
}

export function teardown(rootElement) {
  ReactDOM.unmountComponentAtNode(rootElement);
}

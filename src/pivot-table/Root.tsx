import ReactDOM from 'react-dom';
import React from 'react';
import { PivotTableProps, PivotTable } from './components/PivotTableReact';

export function render(rootElement: Element, props: PivotTableProps): void {
  // eslint-disable-next-line
  ReactDOM.render(<PivotTable {...props} />, rootElement);
}

export function teardown(rootElement: Element): void {
  ReactDOM.unmountComponentAtNode(rootElement);
}

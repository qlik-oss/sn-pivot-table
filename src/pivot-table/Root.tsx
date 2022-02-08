import ReactDOM from 'react-dom';
import React from 'react';
import { PivotTableProps, StickyPivotTable } from './components/PivotTable';

export function render(rootElement: Element, props: PivotTableProps): void {
  // eslint-disable-next-line
  ReactDOM.render(<StickyPivotTable {...props} />, rootElement);
}

export function teardown(rootElement: Element): void {
  ReactDOM.unmountComponentAtNode(rootElement);
}

import ReactDOM from 'react-dom';
import React from 'react';
// import { Provider as PaperProvider } from 'react-native-paper';
import { PivotTableProps, PivotTable, Testing } from './components/PivotTable';

export function render(rootElement: Element, props: PivotTableProps): void {
  // eslint-disable-next-line
  ReactDOM.render(<Testing {...props} />, rootElement);
}

export function teardown(rootElement: Element): void {
  ReactDOM.unmountComponentAtNode(rootElement);
}

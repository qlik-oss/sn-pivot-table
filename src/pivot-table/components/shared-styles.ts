const borderStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: 4,
  borderLeftWidth: 1,
  borderBottomWidth: 1,
  borderRightWidth: 0,
  borderTopWidth: 0,
  borderColor: 'rgb(230, 230, 230)',
  borderStyle: 'solid',
};

const textStyle: React.CSSProperties = {
  fontFamily: '"Source Sans Pro", sans-serif',
  fontSize: 13,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

const gridBorderStyle: React.CSSProperties = {
  borderStyle: 'solid',
  borderColor: '#a6a6a6',
  boxSizing: 'border-box',
};

export {
  borderStyle,
  textStyle,
  gridBorderStyle,
};

module.exports = (api) => {
  const isTest = api.env('test');
  if (isTest) {
    return {
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/typescript'],
      targets: { node: 'current' },
    };
  }

  return {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/typescript'],
  };
};

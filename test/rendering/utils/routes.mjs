export default (baseUrl) => ({
  renderFixture: (fixturePath) => `${baseUrl}/render?fixture=${fixturePath}`,
});

import "@testing-library/jest-dom";

global.document.fonts = {
  load: async () => Promise.resolve(true),
};

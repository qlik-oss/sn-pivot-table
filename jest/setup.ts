import "@testing-library/jest-dom";

type MockDocument = {
  fonts: {
    load: () => Promise<FontFace[]>;
  };
};

(global.document as unknown as MockDocument).fonts = {
  load: async () => Promise.resolve([]),
};

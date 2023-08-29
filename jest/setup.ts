import "@testing-library/jest-dom";

type MockDocument = {
  fonts: {
    load: () => Promise<FontFace[]>;
  };
};

// Custom type otherwise you would get a typescript error as fonts is a read-only property.
(global.document as unknown as MockDocument).fonts = {
  load: async () => Promise.resolve([]),
};

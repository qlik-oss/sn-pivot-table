import includesDigit from "../includes-digit";

describe("includesDigit()", () => {
  let strs: string[];

  test("should return true", () => {
    strs = [
      "textWithoutSpaceAnd1",
      "text with space and 1",
      "text1With2Number3In4Between",
      "text 1 With 2 Number 3 In 4 Between 5 with 6 space",
    ];
    strs.forEach((str) => {
      expect(includesDigit(str)).toBe(true);
    });
  });

  test("should return false", () => {
    strs = ["textWithoutSpace", "text with space"];
    strs.forEach((str) => {
      expect(includesDigit(str)).toBe(false);
    });
  });
});

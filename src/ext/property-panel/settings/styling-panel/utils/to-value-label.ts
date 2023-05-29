export const makeFirstLetterUpperCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const toValueLabel = (value: string, isFontFamily = false) => ({
  value,
  label: isFontFamily ? makeFirstLetterUpperCase(value) : value,
  groupHeader: false,
  disabled: false,
});

const addons = {
  type: "items",
  component: "expandable-items",
  translation: "properties.addons",
  items: {
    dataHandling: {
      uses: "dataHandling",
      items: {
        calcCond: {
          uses: "calcCond",
        },
      },
    },
  },
};

export default addons;

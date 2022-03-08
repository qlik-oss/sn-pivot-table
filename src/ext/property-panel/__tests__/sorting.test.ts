import sorting from '../sorting';

describe('sorting', () => {
  describe('sortByY', () => {
    describe('sortbyYToggle', () => {
      test('convert get', () => {
        const getter = (str: string) => !!str;
        expect(sorting.items.sortbyY.items.sortbyYToggle.convertFunctions.get(getter)).toBe(true);
      });

      test('convert set true', () => {
        const setter = jest.fn();
        sorting.items.sortbyY.items.sortbyYToggle.convertFunctions.set(true, setter);
        expect(setter).toHaveBeenCalledWith('integer', -1);
      });

      test('convert set false', () => {
        const setter = jest.fn();
        sorting.items.sortbyY.items.sortbyYToggle.convertFunctions.set(false, setter);
        expect(setter).toHaveBeenCalledWith('integer', 0);
      });
    });

    describe('sortbyYOrder', () => {
      test('should show', () => {
        const itemData = {
          qHyperCubeDef: {
            qSortbyYValue: true,
          }
        } as unknown as EngineAPI.IGenericHyperCubeProperties;

        expect(sorting.items.sortbyY.items.sortbyYOrder.show(itemData)).toBe(true);
      });

      test('should not show', () => {
        const itemData = {
          qHyperCubeDef: {
            qSortbyYValue: false,
          }
        } as unknown as EngineAPI.IGenericHyperCubeProperties;

        expect(sorting.items.sortbyY.items.sortbyYOrder.show(itemData)).toBe(false);
      });
    });
  });
});

/* eslint jest/no-conditional-expect: 0 */
import settings, { Emitter, ExtendedGenericHyperCubeProperties } from "../settings";

describe("settings", () => {
  describe("alwaysFullyExpanded", () => {
    test("should show showTotalsAbove", () => {
      const props = {
        qHyperCubeDef: {
          qDimensions: [{ qOtherTotalSpec: { qTotalMode: "TOTAL_EXPR" } }],
        },
      } as EngineAPI.IGenericHyperCubeProperties;

      if ("showTotalsAbove" in settings.items.presentation.items[1].items) {
        expect(settings.items.presentation.items[1].items.showTotalsAbove.show(props)).toBe(true);
      }
    });

    test("should not show showTotalsAbove when no dimesion have totals turned on", () => {
      const props = {
        qHyperCubeDef: {
          qDimensions: [{ qOtherTotalSpec: { qTotalMode: "TOTAL_OFF" } }],
        },
      } as EngineAPI.IGenericHyperCubeProperties;
      if ("showTotalsAbove" in settings.items.presentation.items[1].items) {
        expect(settings.items.presentation.items[1].items.showTotalsAbove.show(props)).toBe(false);
      }
    });
  });

  describe("resetProperties", () => {
    test("should be disabled", () => {
      const props = {
        qHyperCubeDef: {
          qAlwaysFullyExpanded: true,
        },
      } as EngineAPI.IGenericHyperCubeProperties;
      if ("resetProperties" in settings.items.presentation.items[1].items) {
        expect(settings.items.presentation.items[1].items.resetProperties.disabled(props)).toBe(true);
      }
    });

    test("should not be disabled", () => {
      const props = {
        qHyperCubeDef: {
          qAlwaysFullyExpanded: false,
        },
      } as EngineAPI.IGenericHyperCubeProperties;

      if ("resetProperties" in settings.items.presentation.items[1].items) {
        expect(settings.items.presentation.items[1].items.resetProperties.disabled(props)).toBe(false);
      }
    });

    test("should trigger action", () => {
      const props = {
        qHyperCubeDef: {
          qExpansionState: [1, 2, 3],
        },
      } as unknown as ExtendedGenericHyperCubeProperties;

      const emitter = { $emit: jest.fn() } as Emitter;

      if ("resetProperties" in settings.items.presentation.items[1].items) {
        settings.items.presentation.items[1].items.resetProperties.action(props, null, null, emitter);
      }

      expect(props.qHyperCubeDef.qExpansionState).toEqual([]);
      expect(emitter.$emit).toHaveBeenCalledWith("saveProperties", props);
    });
  });
});

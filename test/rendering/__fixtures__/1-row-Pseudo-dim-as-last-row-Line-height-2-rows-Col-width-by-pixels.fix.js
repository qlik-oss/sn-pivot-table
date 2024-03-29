export default () => ({
  type: "sn-pivot-table",
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: "mWv",
          qType: "sn-pivot-table",
        },
        qMeta: {
          privileges: ["read"],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 1,
            qcy: 34,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: "Product Group",
              qApprMaxGlyphCount: 19,
              qCardinal: 17,
              qSortIndicator: "A",
              qGroupFallbackTitles: ["Product Group"],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 17,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0,
              },
              qTags: ["$ascii", "$text"],
              qDimensionType: "D",
              qGrouping: "N",
              qNumFormat: {
                qType: "U",
                qnDec: 0,
                qUseThou: 0,
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ["Product Group Desc"],
              qMin: "NaN",
              qMax: "NaN",
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 17,
                qHypercubeCardinal: 17,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "2d0c76e0-f6f6-4dc4-8d9f-55dae429742d",
              title: "Product Group",
              autoSort: true,
              cId: "swWuk",
              columnWidth: {
                type: "pixels",
                pixels: 80,
                percentage: 20,
              },
            },
          ],
          qMeasureInfo: [
            {
              qFallbackTitle: "Avg Sales",
              qApprMaxGlyphCount: 9,
              qCardinal: 0,
              qSortIndicator: "D",
              qNumFormat: {
                qType: "R",
                qnDec: 0,
                qUseThou: 0,
                qFmt: "########",
                qDec: ".",
                qThou: ",",
              },
              qMin: 89.57776659959794,
              qMax: 1689.5829149687647,
              qIsAutoFormat: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qLibraryId: "LvjWKp",
              qTrendLines: [],
              autoSort: true,
              cId: "stjQfQ",
              columnWidth: {
                type: "pixels",
                pixels: 50,
                percentage: 20,
              },
              quarantine: {
                qNumFormat: {},
                isCustomFormatted: false,
              },
            },
            {
              qFallbackTitle: "Actual Amount",
              qApprMaxGlyphCount: 11,
              qCardinal: 0,
              qSortIndicator: "D",
              qNumFormat: {
                qType: "U",
                qnDec: 0,
                qUseThou: 0,
              },
              qMin: 12468614.120000012,
              qMax: 46169928.44,
              qIsAutoFormat: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qLibraryId: "vDhvSum",
              qTrendLines: [],
              coloring: {},
              autoSort: true,
              cId: "TDsUJK",
              columnWidth: {
                type: "pixels",
                pixels: 50,
                percentage: 20,
              },
              quarantine: {
                qNumFormat: {},
                isCustomFormatted: false,
              },
            },
          ],
          qEffectiveInterColumnSortOrder: [0, -1],
          qGrandTotalRow: [],
          qDataPages: [],
          qPivotDataPages: [
            {
              qLeft: [
                {
                  qText: "Alcoholic Beverages",
                  qElemNo: 0,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Baked Goods",
                  qElemNo: 1,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Baking Goods",
                  qElemNo: 12,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Beverages",
                  qElemNo: 2,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Breakfast Foods",
                  qElemNo: 3,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Canned Foods",
                  qElemNo: 4,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Canned Products",
                  qElemNo: 13,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Dairy",
                  qElemNo: 5,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Deli",
                  qElemNo: 6,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Eggs",
                  qElemNo: 14,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Frozen Foods",
                  qElemNo: 15,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Meat",
                  qElemNo: 7,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Produce",
                  qElemNo: 8,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Seafood",
                  qElemNo: 9,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Snack Foods",
                  qElemNo: 10,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Snacks",
                  qElemNo: 11,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
                {
                  qText: "Starchy Foods",
                  qElemNo: 16,
                  qValue: "NaN",
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Avg Sales",
                      qElemNo: 0,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                    {
                      qText: "Actual Amount",
                      qElemNo: 1,
                      qValue: "NaN",
                      qType: "P",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                    },
                  ],
                },
              ],
              qTop: [],
              qData: [
                [
                  {
                    qText: "894.22578",
                    qNum: 894.2257838745734,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "31977963.22",
                    qNum: 31977963.219999917,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "191.89761",
                    qNum: 191.8976078619376,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "43964310.09",
                    qNum: 43964310.089999996,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "743.08696",
                    qNum: 743.0869554663434,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "43425574.5",
                    qNum: 43425574.50000001,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "957.18865",
                    qNum: 957.1886455331397,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "45519720.97",
                    qNum: 45519720.97000001,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "545.17796",
                    qNum: 545.1779600886904,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "42251290.51",
                    qNum: 42251290.510000005,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "552.77785",
                    qNum: 552.7778466819265,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "46169928.44",
                    qNum: 46169928.44,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "308.68511",
                    qNum: 308.685106888361,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "23734607.63",
                    qNum: 23734607.62999996,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "583.79169",
                    qNum: 583.7916865370527,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "45851206.03",
                    qNum: 45851206.030000016,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "1689.5829",
                    qNum: 1689.5829149687647,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "46013046.83",
                    qNum: 46013046.83,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "141.41287",
                    qNum: 141.41286993402463,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "40856871.5",
                    qNum: 40856871.49999998,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "818.78815",
                    qNum: 818.7881548650605,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "46044775.24",
                    qNum: 46044775.24000002,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "279.43372",
                    qNum: 279.43372492836676,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "12468614.12",
                    qNum: 12468614.120000012,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "835.09003",
                    qNum: 835.0900252920687,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "46070618.89",
                    qNum: 46070618.88999999,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "89.577767",
                    qNum: 89.57776659959794,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "27208226.92",
                    qNum: 27208226.919999983,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "385.60422",
                    qNum: 385.60422299487124,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "45638646.7",
                    qNum: 45638646.70000002,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "399.17573",
                    qNum: 399.1757324137933,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "41202525.22",
                    qNum: 41202525.220000006,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "1195.6466",
                    qNum: 1195.6465788638543,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "41724085.14",
                    qNum: 41724085.14000001,
                    qType: "V",
                  },
                ],
              ],
              qArea: {
                qLeft: 0,
                qTop: 0,
                qWidth: 1,
                qHeight: 34,
              },
            },
          ],
          qStackedDataPages: [],
          qMode: "P",
          qNoOfLeftDims: 2,
          qTreeNodesOnDim: [],
          qColumnOrder: [],
        },
        search: {
          sorting: "auto",
        },
        showTitles: true,
        title: "",
        subtitle: "1 row, pseudo dim as last row. Line height 2 rows. Column width by pixels",
        footnote: "",
        disableNavMenu: false,
        showDetails: true,
        showDetailsExpression: false,
        components: [
          {
            key: "general",
          },
          {
            key: "theme",
            grid: {
              lineClamp: 2,
            },
          },
        ],
        nullValueRepresentation: {
          text: "-",
        },
        visualization: "sn-pivot-table",
        version: "2.3.0",
        extensionMeta: {
          translationKey: "",
          icon: "puzzle",
          iconChar: "puzzle",
          isLibraryItem: true,
          visible: true,
          IconDefinition: {},
          name: "sn-pivot-table",
          description: "Pivot table supernova",
          template: "sn-pivot-table",
          iconPath:
            "M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z",
          isThirdParty: true,
          id: "rmQctFcQtWrx-gPyk6gzUvfnphijKOxY",
          tenantId: "So2tYBBh-SeC2uqq2ghwvPxTRS9ca45i",
          userId: "Tc_Xcu0ACCRJHvXCacSY0_VWrOZIqP0C",
          type: "visualization",
          qextFilename: "sn-pivot-table",
          qextVersion: "2.4.0",
          loadpath: "sn-pivot-table",
          version: "56.0.0",
          author: "QlikTech International AB",
          tags: [],
          checksum: null,
          bundled: false,
          supernova: true,
          file: {
            contentType: "application/zip",
            contentLength: 1252280,
            md5: "0cfe6bc70ecb73fed6e32eae923b973d",
            fileId: "fZgQ8eKieiuvW6LXsXhjMMgHRRn_M4xP",
            originalname: "sn-pivot-table-ext.zip",
          },
          createdAt: "2023-10-06T12:44:39.924Z",
          updatedAt: "2023-11-16T10:07:02.333Z",
          cloud: true,
        },
        appId: "1aac3e7b-5681-43c3-8516-8269ba82c0d2",
      },
      getEffectiveProperties: {
        qHyperCubeDef: {},
      },
    },
  ],
});

export default () => ({
  type: "sn-pivot-table",
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: "Dwxd",
          qType: "sn-pivot-table",
        },
        qMeta: {
          privileges: ["read"],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 42,
            qcy: 15,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: "Year",
              qApprMaxGlyphCount: 4,
              qCardinal: 2,
              qSortIndicator: "A",
              qGroupFallbackTitles: ["Year"],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 2,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0,
              },
              qTags: ["$numeric", "$integer"],
              qDimensionType: "N",
              qGrouping: "N",
              qNumFormat: {
                qType: "I",
                qnDec: 0,
                qUseThou: 0,
                qFmt: "###0",
                qDec: ".",
                qThou: ",",
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ["Year"],
              qMin: 2006,
              qMax: 2007,
              qContinuousAxes: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 2,
                qHypercubeCardinal: 3,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "7cd6768c-03dc-42d7-b6d0-02b6b25d38fd",
              title: "Year",
              autoSort: true,
              cId: "kvskHQt",
              columnWidth: {
                type: "auto",
                pixels: 200,
                percentage: 20,
              },
            },
            {
              qFallbackTitle: "Month",
              qApprMaxGlyphCount: 3,
              qCardinal: 12,
              qSortIndicator: "A",
              qGroupFallbackTitles: ["Month"],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 12,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0,
              },
              qTags: ["$numeric", "$integer"],
              qDimensionType: "N",
              qGrouping: "N",
              qNumFormat: {
                qType: "U",
                qnDec: 0,
                qUseThou: 0,
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ["Month"],
              qMin: 1,
              qMax: 12,
              qAttrExprInfo: [
                {
                  qMin: 152173896,
                  qMax: 4167860793,
                  qFallbackTitle: "=argb(rand() * 255, rand() * 255, rand() * 255, rand() * 255)",
                  qMinText: "ARGB(9,17,253,72)",
                  qMaxText: "ARGB(248,108,130,57)",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "cellBackgroundColor",
                },
                {
                  qMin: 4286578688,
                  qMax: 4286578688,
                  qFallbackTitle: "=red()",
                  qMinText: "RGB(128,0,0)",
                  qMaxText: "RGB(128,0,0)",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "cellForegroundColor",
                },
              ],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 12,
                qHypercubeCardinal: 13,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "KHvcSGE",
              title: "Month",
              autoSort: true,
              cId: "arNRFP",
              columnWidth: {
                type: "auto",
                pixels: 200,
                percentage: 20,
              },
            },
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
                qHypercubeCardinal: 19,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "2d0c76e0-f6f6-4dc4-8d9f-55dae429742d",
              title: "Product Group",
              autoSort: true,
              cId: "RugWuf",
              columnWidth: {
                type: "auto",
                pixels: 200,
                percentage: 20,
              },
            },
            {
              qFallbackTitle: "Product Sub Group",
              qApprMaxGlyphCount: 17,
              qCardinal: 70,
              qSortIndicator: "A",
              qGroupFallbackTitles: ["Product Sub Group"],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 70,
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
              qGroupFieldDefs: ["Product Sub Group Desc"],
              qMin: "NaN",
              qMax: "NaN",
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 70,
                qHypercubeCardinal: 3,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "e1432d2b-be66-4e9f-a134-65327550e346",
              title: "Product Sub Group",
              autoSort: true,
              cId: "bxFY",
              columnWidth: {
                type: "auto",
                pixels: 200,
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
              qMin: 179.0118181818182,
              qMax: 1813.1842241379297,
              qIsAutoFormat: true,
              qAttrExprInfo: [
                {
                  qMin: 4280421828,
                  qMax: 4294889229,
                  qFallbackTitle: "=hsl(rand(), rand(), rand())",
                  qMinText: "RGB(34,13,196)",
                  qMaxText: "RGB(254,207,13)",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "cellBackgroundColor",
                },
                {
                  qMin: 4294967040,
                  qMax: 4294967040,
                  qFallbackTitle: "=yellow()",
                  qMinText: "RGB(255,255,0)",
                  qMaxText: "RGB(255,255,0)",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "cellForegroundColor",
                },
              ],
              qAttrDimInfo: [],
              qLibraryId: "LvjWKp",
              qTrendLines: [],
              autoSort: true,
              cId: "stjQfQ",
              columnWidth: {
                type: "auto",
                pixels: 200,
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
              qMin: 1016271.5100000002,
              qMax: 11407750.620000005,
              qIsAutoFormat: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qLibraryId: "vDhvSum",
              qTrendLines: [],
              coloring: {},
              autoSort: true,
              cId: "TDsUJK",
              columnWidth: {
                type: "auto",
                pixels: 200,
                percentage: 20,
              },
              quarantine: {
                qNumFormat: {},
                isCustomFormatted: false,
              },
            },
          ],
          qEffectiveInterColumnSortOrder: [0, 1, 2, 3, -1],
          qGrandTotalRow: [],
          qDataPages: [],
          qPivotDataPages: [
            {
              qLeft: [
                {
                  qText: "2006",
                  qElemNo: 1,
                  qValue: 2006,
                  qCanCollapse: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Jan",
                      qElemNo: 2,
                      qValue: 1,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(38,223,178,11)",
                            qNum: 652194315,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Feb",
                      qElemNo: 9,
                      qValue: 2,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(85,99,158,250)",
                            qNum: 1432592122,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Mar",
                      qElemNo: 10,
                      qValue: 3,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(156,100,6,69)",
                            qNum: 2623800901,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Apr",
                      qElemNo: 0,
                      qValue: 4,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(85,171,247,120)",
                            qNum: 1437333368,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "May",
                      qElemNo: 11,
                      qValue: 5,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(226,142,168,178)",
                            qNum: 3801000114,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Jun",
                      qElemNo: 1,
                      qValue: 6,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(95,115,130,202)",
                            qNum: 1601405642,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Jul",
                      qElemNo: 8,
                      qValue: 7,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(144,71,168,9)",
                            qNum: 2420615177,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Aug",
                      qElemNo: 5,
                      qValue: 8,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(49,150,107,86)",
                            qNum: 831941462,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Sep",
                      qElemNo: 3,
                      qValue: 9,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(155,241,40,10)",
                            qNum: 2616272906,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Oct",
                      qElemNo: 6,
                      qValue: 10,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(156,57,51,153)",
                            qNum: 2620994457,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Nov",
                      qElemNo: 4,
                      qValue: 11,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(62,11,91,229)",
                            qNum: 1040931813,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Dec",
                      qElemNo: 7,
                      qValue: 12,
                      qType: "N",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(20,152,179,227)",
                            qNum: 345551843,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                    {
                      qText: "Total",
                      qElemNo: -1,
                      qValue: "NaN",
                      qType: "T",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(92,55,204,90)",
                            qNum: 1547160666,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  qText: "2007",
                  qElemNo: 0,
                  qValue: 2007,
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qNum: "NaN",
                          },
                          {
                            qNum: "NaN",
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  qText: "Total",
                  qElemNo: -1,
                  qValue: "NaN",
                  qType: "T",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
                      qUp: 0,
                      qDown: 0,
                      qSubNodes: [],
                      qAttrExps: {
                        qValues: [
                          {
                            qText: "ARGB(109,226,179,63)",
                            qNum: 1843573567,
                          },
                          {
                            qText: "RGB(128,0,0)",
                            qNum: 4286578688,
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
              qTop: [
                {
                  qText: "Alcoholic Beverages",
                  qElemNo: 0,
                  qValue: "NaN",
                  qCanCollapse: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qText: "Beer",
                      qElemNo: 33,
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
                      qText: "Wine",
                      qElemNo: 34,
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
                      qText: "Total",
                      qElemNo: -1,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Baked Goods",
                  qElemNo: 1,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Baking Goods",
                  qElemNo: 12,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Beverages",
                  qElemNo: 2,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Breakfast Foods",
                  qElemNo: 3,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Canned Foods",
                  qElemNo: 4,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Canned Products",
                  qElemNo: 13,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Dairy",
                  qElemNo: 5,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Deli",
                  qElemNo: 6,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Eggs",
                  qElemNo: 14,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Frozen Foods",
                  qElemNo: 15,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Meat",
                  qElemNo: 7,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Produce",
                  qElemNo: 8,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Seafood",
                  qElemNo: 9,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Snack Foods",
                  qElemNo: 10,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Snacks",
                  qElemNo: 11,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Starchy Foods",
                  qElemNo: 16,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "-",
                  qElemNo: -2,
                  qValue: "NaN",
                  qCanExpand: true,
                  qType: "U",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
                {
                  qText: "Total",
                  qElemNo: -1,
                  qValue: "NaN",
                  qType: "T",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
                    {
                      qElemNo: -4,
                      qValue: "NaN",
                      qType: "T",
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
                },
              ],
              qData: [
                [
                  {
                    qText: "337.06819",
                    qNum: 337.06819444444443,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(127,24,104)",
                          qNum: 4286519400,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2161348.24",
                    qNum: 2161348.2399999993,
                    qType: "V",
                  },
                  {
                    qText: "1449.4731",
                    qNum: 1449.4730769230769,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(166,250,157)",
                          qNum: 4289133213,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2170155.99",
                    qNum: 2170155.989999999,
                    qType: "V",
                  },
                  {
                    qText: "1025.6998",
                    qNum: 1025.6997883597885,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(166,197,209)",
                          qNum: 4289119697,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3859865.7",
                    qNum: 3859865.7,
                    qType: "V",
                  },
                  {
                    qText: "183.10252",
                    qNum: 183.10252293577994,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(223,51,61)",
                          qNum: 4292817725,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2416815.25",
                    qNum: 2416815.249999999,
                    qType: "V",
                  },
                  {
                    qText: "561.13961",
                    qNum: 561.1396082474229,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(65,65,67)",
                          qNum: 4282466627,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13366352.94",
                    qNum: 13366352.940000024,
                    qType: "V",
                  },
                  {
                    qText: "663.86301",
                    qNum: 663.8630103806227,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(58,1,71)",
                          qNum: 4281991495,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4594880.58",
                    qNum: 4594880.580000002,
                    qType: "V",
                  },
                  {
                    qText: "137.67987",
                    qNum: 137.67987499999998,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(45,218,107)",
                          qNum: 4281195115,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4120363.33",
                    qNum: 4120363.3300000005,
                    qType: "V",
                  },
                  {
                    qText: "558.27454",
                    qNum: 558.2745352564106,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(38,190,160)",
                          qNum: 4280729248,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11225035.38",
                    qNum: 11225035.38000002,
                    qType: "V",
                  },
                  {
                    qText: "1079.6879",
                    qNum: 1079.687894736842,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(187,188,154)",
                          qNum: 4290493594,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "808766.22",
                    qNum: 808766.22,
                    qType: "V",
                  },
                  {
                    qText: "394.48531",
                    qNum: 394.4853144016222,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(134,39,155)",
                          qNum: 4286982043,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12520206.26",
                    qNum: 12520206.260000017,
                    qType: "V",
                  },
                  {
                    qText: "1625.8326",
                    qNum: 1625.8326086956542,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(234,15,57)",
                          qNum: 4293529401,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "15083111.39",
                    qNum: 15083111.390000012,
                    qType: "V",
                  },
                  {
                    qText: "182.06619",
                    qNum: 182.0661904761904,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(197,195,204)",
                          qNum: 4291150796,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4754957.02",
                    qNum: 4754957.020000002,
                    qType: "V",
                  },
                  {
                    qText: "1054.4374",
                    qNum: 1054.4374433249366,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(200,185,196)",
                          qNum: 4291344836,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10576803.23",
                    qNum: 10576803.230000021,
                    qType: "V",
                  },
                  {
                    qText: "132.68368",
                    qNum: 132.6836842105263,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(239,193,91)",
                          qNum: 4293902683,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "483033.09",
                    qNum: 483033.09,
                    qType: "V",
                  },
                  {
                    qText: "976.48823",
                    qNum: 976.488233809928,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(129,90,118)",
                          qNum: 4286667382,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "17776137.65",
                    qNum: 17776137.649999987,
                    qType: "V",
                  },
                  {
                    qText: "107.6796",
                    qNum: 107.6796,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(226,197,228)",
                          qNum: 4293051876,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "364699.45",
                    qNum: 364699.45,
                    qType: "V",
                  },
                  {
                    qText: "335.53028",
                    qNum: 335.530283687943,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(183,80,206)",
                          qNum: 4290203854,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13053944.43",
                    qNum: 13053944.430000018,
                    qType: "V",
                  },
                  {
                    qText: "306.90137",
                    qNum: 306.9013661202185,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(126,119,100)",
                          qNum: 4286478180,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4034130.48",
                    qNum: 4034130.4800000004,
                    qType: "V",
                  },
                  {
                    qText: "261.56533",
                    qNum: 261.5653333333333,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(69,57,70)",
                          qNum: 4282726726,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4892103.31",
                    qNum: 4892103.31,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "723.61718",
                    qNum: 723.6171779935268,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(101,133,62)",
                          qNum: 4284843326,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "28183803.25",
                    qNum: 28183803.249999944,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "271.42389",
                    qNum: 271.4238888888889,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(47,70,28)",
                          qNum: 4281288220,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4157833.3",
                    qNum: 4157833.3000000007,
                    qType: "V",
                  },
                  {
                    qText: "1052.5759",
                    qNum: 1052.5758947368422,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(219,224,230)",
                          qNum: 4292600038,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3555603.82",
                    qNum: 3555603.8200000008,
                    qType: "V",
                  },
                  {
                    qText: "769.47383",
                    qNum: 769.4738255033558,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(65,96,37)",
                          qNum: 4282474533,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "7449161.88",
                    qNum: 7449161.880000008,
                    qType: "V",
                  },
                  {
                    qText: "169.38795",
                    qNum: 169.3879473684211,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(102,72,136)",
                          qNum: 4284893320,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2737966.01",
                    qNum: 2737966.0100000007,
                    qType: "V",
                  },
                  {
                    qText: "633.7115",
                    qNum: 633.7114957264953,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(121,42,84)",
                          qNum: 4286130772,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12430013.94",
                    qNum: 12430013.940000016,
                    qType: "V",
                  },
                  {
                    qText: "459.65537",
                    qNum: 459.65536842105246,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(207,210,198)",
                          qNum: 4291809990,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11400268.24",
                    qNum: 11400268.240000019,
                    qType: "V",
                  },
                  {
                    qText: "2311.6048",
                    qNum: 2311.6047999999996,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(76,85,75)",
                          qNum: 4283192651,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3390943.3",
                    qNum: 3390943.299999998,
                    qType: "V",
                  },
                  {
                    qText: "506.21523",
                    qNum: 506.2152252252249,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(42,29,44)",
                          qNum: 4280950060,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10594383.76",
                    qNum: 10594383.760000015,
                    qType: "V",
                  },
                  {
                    qText: "218.09897",
                    qNum: 218.09897435897437,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(246,204,243)",
                          qNum: 4294364403,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3657012.16",
                    qNum: 3657012.1599999997,
                    qType: "V",
                  },
                  {
                    qText: "614.34935",
                    qNum: 614.3493534482755,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(12,78,194)",
                          qNum: 4278996674,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "7353372.43",
                    qNum: 7353372.430000012,
                    qType: "V",
                  },
                  {
                    qText: "2273.2892",
                    qNum: 2273.289233716475,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(12,30,138)",
                          qNum: 4278984330,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "14831799.53",
                    qNum: 14831799.530000005,
                    qType: "V",
                  },
                  {
                    qText: "113.19375",
                    qNum: 113.19375000000001,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(181,179,182)",
                          qNum: 4290098102,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "1422649.17",
                    qNum: 1422649.1699999988,
                    qType: "V",
                  },
                  {
                    qText: "943.88923",
                    qNum: 943.8892262773716,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(254,247,250)",
                          qNum: 4294899706,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10624145.25",
                    qNum: 10624145.250000017,
                    qType: "V",
                  },
                  {
                    qText: "102.36947",
                    qNum: 102.36947368421052,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(144,86,24)",
                          qNum: 4287649304,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "403860.13",
                    qNum: 403860.13000000006,
                    qType: "V",
                  },
                  {
                    qText: "900.50288",
                    qNum: 900.5028842676312,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(232,187,184)",
                          qNum: 4293442488,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "28551843.01",
                    qNum: 28551843.009999953,
                    qType: "V",
                  },
                  {
                    qText: "114.054",
                    qNum: 114.05400000000002,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(22,21,23)",
                          qNum: 4279637271,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "523729.24",
                    qNum: 523729.2400000001,
                    qType: "V",
                  },
                  {
                    qText: "589.76006",
                    qNum: 589.7600557103061,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(23,24,22)",
                          qNum: 4279703574,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10767748.79",
                    qNum: 10767748.790000012,
                    qType: "V",
                  },
                  {
                    qText: "390.57763",
                    qNum: 390.57762820512835,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(242,249,206)",
                          qNum: 4294113742,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8488690.89",
                    qNum: 8488690.890000014,
                    qType: "V",
                  },
                  {
                    qText: "906.55118",
                    qNum: 906.5511764705877,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(50,43,25)",
                          qNum: 4281477913,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "7623371.83",
                    qNum: 7623371.830000005,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "828.84168",
                    qNum: 828.8416824805179,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(172,173,201)",
                          qNum: 4289506761,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "37617957.02",
                    qNum: 37617957.019999996,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "228.05214",
                    qNum: 228.05214285714288,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(234,226,225)",
                          qNum: 4293583585,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2397278.76",
                    qNum: 2397278.7600000002,
                    qType: "V",
                  },
                  {
                    qText: "1146.8574",
                    qNum: 1146.8573863636364,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(208,52,22)",
                          qNum: 4291834902,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2880985.5",
                    qNum: 2880985.499999999,
                    qType: "V",
                  },
                  {
                    qText: "925.07681",
                    qNum: 925.0768103448277,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(41,45,40)",
                          qNum: 4280888616,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3201407.68",
                    qNum: 3201407.680000001,
                    qType: "V",
                  },
                  {
                    qText: "176.21072",
                    qNum: 176.2107207207206,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(191,215,242)",
                          qNum: 4290762738,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6123607.8",
                    qNum: 6123607.800000002,
                    qType: "V",
                  },
                  {
                    qText: "810.27518",
                    qNum: 810.275175644028,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(118,39,168)",
                          qNum: 4285933480,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8753330.47",
                    qNum: 8753330.470000012,
                    qType: "V",
                  },
                  {
                    qText: "1516.7524",
                    qNum: 1516.7524110671939,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(197,163,253)",
                          qNum: 4291142653,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8063529.19",
                    qNum: 8063529.19000001,
                    qType: "V",
                  },
                  {
                    qText: "497.31416",
                    qNum: 497.3141558441558,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(252,223,240)",
                          qNum: 4294762480,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5521886.91",
                    qNum: 5521886.910000003,
                    qType: "V",
                  },
                  {
                    qText: "627.78329",
                    qNum: 627.7832941176479,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(31,8,23)",
                          qNum: 4280223767,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10874588.87",
                    qNum: 10874588.870000012,
                    qType: "V",
                  },
                  {
                    qText: "353.77516",
                    qNum: 353.77516129032267,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(236,227,242)",
                          qNum: 4293714930,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "318624.21",
                    qNum: 318624.21,
                    qType: "V",
                  },
                  {
                    qText: "622.75128",
                    qNum: 622.7512809917354,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(28,83,51)",
                          qNum: 4280046387,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9919909.12",
                    qNum: 9919909.12000002,
                    qType: "V",
                  },
                  {
                    qText: "1682.4497",
                    qNum: 1682.4496917148367,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(2,33,35)",
                          qNum: 4278329635,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "14326703.87",
                    qNum: 14326703.870000001,
                    qType: "V",
                  },
                  {
                    qText: "131.3556",
                    qNum: 131.3556,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(252,252,253)",
                          qNum: 4294769917,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5071516.45",
                    qNum: 5071516.450000002,
                    qType: "V",
                  },
                  {
                    qText: "1123.2738",
                    qNum: 1123.2738410596028,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(198,92,199)",
                          qNum: 4291189959,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "14370836.74",
                    qNum: 14370836.740000006,
                    qType: "V",
                  },
                  {
                    qText: "187.7",
                    qNum: 187.70000000000002,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(4,6,4)",
                          qNum: 4278453764,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "557570.76",
                    qNum: 557570.7600000001,
                    qType: "V",
                  },
                  {
                    qText: "464.2637",
                    qNum: 464.2636958443855,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(241,58,238)",
                          qNum: 4293999342,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "24715926.89",
                    qNum: 24715926.88999996,
                    qType: "V",
                  },
                  {
                    qText: "83.991944",
                    qNum: 83.99194444444443,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(203,212,207)",
                          qNum: 4291548367,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12529544.6",
                    qNum: 12529544.6,
                    qType: "V",
                  },
                  {
                    qText: "494.02612",
                    qNum: 494.02611878453,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(116,226,116)",
                          qNum: 4285850228,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "22432679.8",
                    qNum: 22432679.799999967,
                    qType: "V",
                  },
                  {
                    qText: "542.62526",
                    qNum: 542.6252564102563,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(28,93,116)",
                          qNum: 4280049012,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3724673.69",
                    qNum: 3724673.6900000027,
                    qType: "V",
                  },
                  {
                    qText: "2141.903",
                    qNum: 2141.9030487804885,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(248,193,195)",
                          qNum: 4294492611,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4067160.06",
                    qNum: 4067160.0600000015,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "797.76966",
                    qNum: 797.7696567057998,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(188,171,248)",
                          qNum: 4290554872,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "37196884.45",
                    qNum: 37196884.449999996,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "445.80585",
                    qNum: 445.8058490566037,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(253,250,249)",
                          qNum: 4294834937,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5188017.98",
                    qNum: 5188017.979999999,
                    qType: "V",
                  },
                  {
                    qText: "1606.5729",
                    qNum: 1606.5729126213594,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(185,81,230)",
                          qNum: 4290335206,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "1619459.33",
                    qNum: 1619459.3299999984,
                    qType: "V",
                  },
                  {
                    qText: "1212.2097",
                    qNum: 1212.2097435897438,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(137,42,6)",
                          qNum: 4287179270,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6338326.23",
                    qNum: 6338326.230000009,
                    qType: "V",
                  },
                  {
                    qText: "206.1978",
                    qNum: 206.1978034682081,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(27,39,41)",
                          qNum: 4279969577,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "1780196.24",
                    qNum: 1780196.2399999986,
                    qType: "V",
                  },
                  {
                    qText: "939.71235",
                    qNum: 939.7123545706373,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(249,220,240)",
                          qNum: 4294565104,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11520780.62",
                    qNum: 11520780.620000014,
                    qType: "V",
                  },
                  {
                    qText: "1017.1273",
                    qNum: 1017.1273423423422,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(26,51,143)",
                          qNum: 4279907215,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4096967.92",
                    qNum: 4096967.920000001,
                    qType: "V",
                  },
                  {
                    qText: "298.10571",
                    qNum: 298.1057142857144,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(163,163,164)",
                          qNum: 4288914340,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "598236.28",
                    qNum: 598236.2800000003,
                    qType: "V",
                  },
                  {
                    qText: "457.23868",
                    qNum: 457.2386825053995,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(124,91,203)",
                          qNum: 4286340043,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10205001.42",
                    qNum: 10205001.420000017,
                    qType: "V",
                  },
                  {
                    qText: "1234.9203",
                    qNum: 1234.9203030303029,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(196,25,76)",
                          qNum: 4291041612,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "676125.57",
                    qNum: 676125.5700000002,
                    qType: "V",
                  },
                  {
                    qText: "423.97969",
                    qNum: 423.9796941176474,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(14,58,3)",
                          qNum: 4279122435,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11528073.27",
                    qNum: 11528073.270000014,
                    qType: "V",
                  },
                  {
                    qText: "1827.9128",
                    qNum: 1827.912793733682,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(106,205,187)",
                          qNum: 4285189563,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12858809.1",
                    qNum: 12858809.10000001,
                    qType: "V",
                  },
                  {
                    qText: "199.38241",
                    qNum: 199.38240506329112,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(227,202,236)",
                          qNum: 4293118700,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4063845.86",
                    qNum: 4063845.8599999994,
                    qType: "V",
                  },
                  {
                    qText: "846.61092",
                    qNum: 846.6109183673469,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(62,44,123)",
                          qNum: 4282264699,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9883678.75",
                    qNum: 9883678.750000019,
                    qType: "V",
                  },
                  {
                    qText: "142.46313",
                    qNum: 142.463125,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(194,225,237)",
                          qNum: 4290961901,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "336992.72",
                    qNum: 336992.72,
                    qType: "V",
                  },
                  {
                    qText: "567.15026",
                    qNum: 567.1502617801046,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(47,101,119)",
                          qNum: 4281296247,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "16968544.97",
                    qNum: 16968544.970000006,
                    qType: "V",
                  },
                  {
                    qText: "108.56826",
                    qNum: 108.56826086956521,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(41,11,48)",
                          qNum: 4280879920,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "159898.52",
                    qNum: 159898.51999999996,
                    qType: "V",
                  },
                  {
                    qText: "343.20807",
                    qNum: 343.2080715396578,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(154,205,175)",
                          qNum: 4288335279,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9526152.66",
                    qNum: 9526152.660000019,
                    qType: "V",
                  },
                  {
                    qText: "364.90421",
                    qNum: 364.9042105263159,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(64,60,59)",
                          qNum: 4282399803,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5315779.52",
                    qNum: 5315779.520000005,
                    qType: "V",
                  },
                  {
                    qText: "238.00157",
                    qNum: 238.0015662650603,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(103,75,106)",
                          qNum: 4284959594,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4374059.17",
                    qNum: 4374059.170000003,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "684.91185",
                    qNum: 684.9118499272497,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(239,237,250)",
                          qNum: 4293914106,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "26614523.16",
                    qNum: 26614523.15999993,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "233.35938",
                    qNum: 233.35938461538458,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(36,41,36)",
                          qNum: 4280559908,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4905077.73",
                    qNum: 4905077.730000001,
                    qType: "V",
                  },
                  {
                    qText: "193.14144",
                    qNum: 193.14143750000014,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(152,163,97)",
                          qNum: 4288193377,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10783678.84",
                    qNum: 10783678.840000013,
                    qType: "V",
                  },
                  {
                    qText: "204.75996",
                    qNum: 204.75995555555548,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(78,46,102)",
                          qNum: 4283313766,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11271437.24",
                    qNum: 11271437.240000017,
                    qType: "V",
                  },
                  {
                    qText: "161.57039",
                    qNum: 161.5703864734301,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(165,12,145)",
                          qNum: 4289006737,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6546655.98",
                    qNum: 6546655.980000009,
                    qType: "V",
                  },
                  {
                    qText: "843.65319",
                    qNum: 843.6531860036832,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(241,233,203)",
                          qNum: 4294044107,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9538550.65",
                    qNum: 9538550.650000017,
                    qType: "V",
                  },
                  {
                    qText: "1209.2508",
                    qNum: 1209.2507836990596,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(243,239,251)",
                          qNum: 4294176763,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8744747.12",
                    qNum: 8744747.120000007,
                    qType: "V",
                  },
                  {
                    qText: "220.98315",
                    qNum: 220.9831496062993,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(26,89,14)",
                          qNum: 4279916814,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5557958.81",
                    qNum: 5557958.81,
                    qType: "V",
                  },
                  {
                    qText: "364.49975",
                    qNum: 364.4997520661159,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(180,125,166)",
                          qNum: 4290018726,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13876522.76",
                    qNum: 13876522.760000022,
                    qType: "V",
                  },
                  {
                    qText: "223.25073",
                    qNum: 223.25072727272723,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(86,86,81)",
                          qNum: 4283848273,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5692408.7",
                    qNum: 5692408.7,
                    qType: "V",
                  },
                  {
                    qText: "405.16575",
                    qNum: 405.1657499999998,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(168,147,104)",
                          qNum: 4289237864,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10696992.79",
                    qNum: 10696992.790000016,
                    qType: "V",
                  },
                  {
                    qText: "670.80413",
                    qNum: 670.8041279069766,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(5,4,2)",
                          qNum: 4278518786,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10268433.59",
                    qNum: 10268433.590000015,
                    qType: "V",
                  },
                  {
                    qText: "73.344702",
                    qNum: 73.34470198675498,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(180,174,120)",
                          qNum: 4290031224,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4726921.19",
                    qNum: 4726921.190000002,
                    qType: "V",
                  },
                  {
                    qText: "387.2123",
                    qNum: 387.2122974607015,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(84,202,241)",
                          qNum: 4283747057,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "16941191.61",
                    qNum: 16941191.610000007,
                    qType: "V",
                  },
                  {
                    qText: "42.975556",
                    qNum: 42.97555555555555,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(124,169,38)",
                          qNum: 4286359846,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "261572.98",
                    qNum: 261572.98000000004,
                    qType: "V",
                  },
                  {
                    qText: "496.93055",
                    qNum: 496.9305516356633,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(178,202,253)",
                          qNum: 4289907453,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "20111629.69",
                    qNum: 20111629.68999998,
                    qType: "V",
                  },
                  {
                    qText: "78.5784",
                    qNum: 78.57839999999999,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(190,202,212)",
                          qNum: 4290693844,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "1827641.33",
                    qNum: 1827641.3300000003,
                    qType: "V",
                  },
                  {
                    qText: "209.05784",
                    qNum: 209.0578449144008,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(186,214,235)",
                          qNum: 4290434795,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13515855.03",
                    qNum: 13515855.030000016,
                    qType: "V",
                  },
                  {
                    qText: "489.3117",
                    qNum: 489.31170040485813,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(57,124,25)",
                          qNum: 4281957401,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5355162.31",
                    qNum: 5355162.3100000005,
                    qType: "V",
                  },
                  {
                    qText: "205.58733",
                    qNum: 205.5873295454545,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(12,18,16)",
                          qNum: 4278981136,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4109824.41",
                    qNum: 4109824.4100000015,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "53291.89",
                    qNum: 53291.89,
                    qType: "V",
                  },
                  {
                    qText: "453.31454",
                    qNum: 453.3145439232965,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(38,101,251)",
                          qNum: 4280706555,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "27130968.34",
                    qNum: 27130968.339999918,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "195.67635",
                    qNum: 195.6763529411764,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(229,116,56)",
                          qNum: 4293227576,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3976350.47",
                    qNum: 3976350.47,
                    qType: "V",
                  },
                  {
                    qText: "1380.1241",
                    qNum: 1380.1240880503146,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(235,216,251)",
                          qNum: 4293646587,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5753281.28",
                    qNum: 5753281.280000003,
                    qType: "V",
                  },
                  {
                    qText: "967.5091",
                    qNum: 967.509098360656,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(40,63,61)",
                          qNum: 4280827709,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6869839.81",
                    qNum: 6869839.810000007,
                    qType: "V",
                  },
                  {
                    qText: "141.39839",
                    qNum: 141.39839024390236,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(95,77,0)",
                          qNum: 4284435712,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6350837.53",
                    qNum: 6350837.53,
                    qType: "V",
                  },
                  {
                    qText: "554.50491",
                    qNum: 554.5049131944445,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(201,217,248)",
                          qNum: 4291418616,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11928868.79",
                    qNum: 11928868.790000021,
                    qType: "V",
                  },
                  {
                    qText: "411.64785",
                    qNum: 411.64785398230083,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(201,218,197)",
                          qNum: 4291418821,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11724596.9",
                    qNum: 11724596.90000001,
                    qType: "V",
                  },
                  {
                    qText: "98.952581",
                    qNum: 98.95258064516128,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(166,165,166)",
                          qNum: 4289111462,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5225785.47",
                    qNum: 5225785.47,
                    qType: "V",
                  },
                  {
                    qText: "772.59945",
                    qNum: 772.5994452347082,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(178,255,232)",
                          qNum: 4289921000,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13816492.87",
                    qNum: 13816492.870000016,
                    qType: "V",
                  },
                  {
                    qText: "394.49365",
                    qNum: 394.4936538461539,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(16,14,7)",
                          qNum: 4279242247,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2895533.78",
                    qNum: 2895533.78,
                    qType: "V",
                  },
                  {
                    qText: "412.4586",
                    qNum: 412.45860398860367,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(157,88,58)",
                          qNum: 4288501818,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13198555.12",
                    qNum: 13198555.120000014,
                    qType: "V",
                  },
                  {
                    qText: "1744.8958",
                    qNum: 1744.895750394946,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(36,27,35)",
                          qNum: 4280556323,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "15305787.47",
                    qNum: 15305787.470000008,
                    qType: "V",
                  },
                  {
                    qText: "125.17424",
                    qNum: 125.17423728813561,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(248,248,254)",
                          qNum: 4294506750,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4357062.26",
                    qNum: 4357062.26,
                    qType: "V",
                  },
                  {
                    qText: "680.25091",
                    qNum: 680.2509071038249,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(94,181,110)",
                          qNum: 4284396910,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "16393440.47",
                    qNum: 16393440.469999995,
                    qType: "V",
                  },
                  {
                    qText: "109.56455",
                    qNum: 109.56454545454544,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(120,237,169)",
                          qNum: 4286115241,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3990327.11",
                    qNum: 3990327.1099999994,
                    qType: "V",
                  },
                  {
                    qText: "607.29408",
                    qNum: 607.2940774015202,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(235,174,116)",
                          qNum: 4293635700,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "17527604.32",
                    qNum: 17527604.32,
                    qType: "V",
                  },
                  {
                    qText: "76.2975",
                    qNum: 76.29749999999999,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(203,132,223)",
                          qNum: 4291527903,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "828953.61",
                    qNum: 828953.6100000002,
                    qType: "V",
                  },
                  {
                    qText: "252.22101",
                    qNum: 252.22101492537308,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(138,74,238)",
                          qNum: 4287253230,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12104688.72",
                    qNum: 12104688.720000017,
                    qType: "V",
                  },
                  {
                    qText: "409.31749",
                    qNum: 409.3174893617019,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(131,155,105)",
                          qNum: 4286815081,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6696718.1",
                    qNum: 6696718.100000001,
                    qType: "V",
                  },
                  {
                    qText: "269.78765",
                    qNum: 269.7876510067115,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(56,99,71)",
                          qNum: 4281885511,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9366560.23",
                    qNum: 9366560.230000008,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "53291.89",
                    qNum: 53291.89,
                    qType: "V",
                  },
                  {
                    qText: "612.11711",
                    qNum: 612.1171086240956,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(221,246,252)",
                          qNum: 4292736764,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "27066675.24",
                    qNum: 27066675.23999995,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "316.39229",
                    qNum: 316.39228571428566,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(247,247,246)",
                          qNum: 4294440950,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5756833.81",
                    qNum: 5756833.810000002,
                    qType: "V",
                  },
                  {
                    qText: "309.34914",
                    qNum: 309.3491390728478,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(71,230,11)",
                          qNum: 4282902027,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9426473.99",
                    qNum: 9426473.99000001,
                    qType: "V",
                  },
                  {
                    qText: "311.58",
                    qNum: 311.5800000000001,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(41,54,77)",
                          qNum: 4280890957,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13211382.17",
                    qNum: 13211382.17000001,
                    qType: "V",
                  },
                  {
                    qText: "154.77823",
                    qNum: 154.77822510822512,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(127,137,126)",
                          qNum: 4286548350,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3345112.84",
                    qNum: 3345112.8400000012,
                    qType: "V",
                  },
                  {
                    qText: "680.6603",
                    qNum: 680.6603012048191,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(215,211,207)",
                          qNum: 4292334543,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13970098.97",
                    qNum: 13970098.970000008,
                    qType: "V",
                  },
                  {
                    qText: "491.36037",
                    qNum: 491.36037463976936,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(254,229,233)",
                          qNum: 4294895081,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10769983.84",
                    qNum: 10769983.840000017,
                    qType: "V",
                  },
                  {
                    qText: "185.69141",
                    qNum: 185.69141304347835,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(244,239,251)",
                          qNum: 4294242299,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3540634.45",
                    qNum: 3540634.4500000007,
                    qType: "V",
                  },
                  {
                    qText: "354.30011",
                    qNum: 354.3001095461658,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(203,226,234)",
                          qNum: 4291551978,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12445015.56",
                    qNum: 12445015.560000021,
                    qType: "V",
                  },
                  {
                    qText: "779.34868",
                    qNum: 779.3486792452829,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(238,242,199)",
                          qNum: 4293849799,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6274564.34",
                    qNum: 6274564.34,
                    qType: "V",
                  },
                  {
                    qText: "291.02506",
                    qNum: 291.02506306306304,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(247,245,219)",
                          qNum: 4294440411,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12319931.89",
                    qNum: 12319931.890000017,
                    qType: "V",
                  },
                  {
                    qText: "1448.8426",
                    qNum: 1448.8425714285725,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(8,165,169)",
                          qNum: 4278756777,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "15306895.08",
                    qNum: 15306895.08,
                    qType: "V",
                  },
                  {
                    qText: "136.74246",
                    qNum: 136.74245762711863,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(59,123,55)",
                          qNum: 4282088247,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6847684.56",
                    qNum: 6847684.560000005,
                    qType: "V",
                  },
                  {
                    qText: "665.45759",
                    qNum: 665.4575935162097,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(170,209,222)",
                          qNum: 4289384926,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13189236.51",
                    qNum: 13189236.510000026,
                    qType: "V",
                  },
                  {
                    qText: "97.350769",
                    qNum: 97.35076923076923,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(38,77,252)",
                          qNum: 4280700412,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2580372.72",
                    qNum: 2580372.7199999993,
                    qType: "V",
                  },
                  {
                    qText: "389.99837",
                    qNum: 389.9983694779115,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(77,211,118)",
                          qNum: 4283290486,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "20001227.08",
                    qNum: 20001227.079999976,
                    qType: "V",
                  },
                  {
                    qText: "74.501613",
                    qNum: 74.50161290322578,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(182,14,234)",
                          qNum: 4290121450,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3791250.67",
                    qNum: 3791250.67,
                    qType: "V",
                  },
                  {
                    qText: "255.89831",
                    qNum: 255.8983101851852,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(17,17,17)",
                          qNum: 4279308561,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "17208421.06",
                    qNum: 17208421.060000002,
                    qType: "V",
                  },
                  {
                    qText: "222.78876",
                    qNum: 222.78875576036867,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(10,10,16)",
                          qNum: 4278848016,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5665766.68",
                    qNum: 5665766.6800000025,
                    qType: "V",
                  },
                  {
                    qText: "143.76108",
                    qNum: 143.76107692307693,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(68,226,125)",
                          qNum: 4282704509,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "7528956",
                    qNum: 7528955.999999998,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "53291.89",
                    qNum: 53291.89,
                    qType: "V",
                  },
                  {
                    qText: "472.43085",
                    qNum: 472.43084921481847,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(250,250,251)",
                          qNum: 4294638331,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "27602211.13",
                    qNum: 27602211.12999994,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "224.86478",
                    qNum: 224.864776119403,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(208,125,195)",
                          qNum: 4291853763,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4560737.69",
                    qNum: 4560737.690000002,
                    qType: "V",
                  },
                  {
                    qText: "713.72193",
                    qNum: 713.7219285714286,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(254,207,13)",
                          qNum: 4294889229,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4719510.7",
                    qNum: 4719510.700000004,
                    qType: "V",
                  },
                  {
                    qText: "555.4928",
                    qNum: 555.4928019323671,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(233,251,195)",
                          qNum: 4293524419,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8425328.84",
                    qNum: 8425328.840000013,
                    qType: "V",
                  },
                  {
                    qText: "136.1119",
                    qNum: 136.11189516129033,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(8,8,9)",
                          qNum: 4278716425,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11002508.42",
                    qNum: 11002508.420000013,
                    qType: "V",
                  },
                  {
                    qText: "471.0177",
                    qNum: 471.01770416024624,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(190,236,109)",
                          qNum: 4290702445,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "14083326.76",
                    qNum: 14083326.760000017,
                    qType: "V",
                  },
                  {
                    qText: "384.95013",
                    qNum: 384.9501322314049,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(69,7,80)",
                          qNum: 4282713936,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13885906.31",
                    qNum: 13885906.310000015,
                    qType: "V",
                  },
                  {
                    qText: "1674.0702",
                    qNum: 1674.0701923076917,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(215,230,209)",
                          qNum: 4292339409,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6790586.34",
                    qNum: 6790586.3400000045,
                    qType: "V",
                  },
                  {
                    qText: "376.30336",
                    qNum: 376.3033589743584,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(158,71,170)",
                          qNum: 4288563114,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "14336916.81",
                    qNum: 14336916.81000001,
                    qType: "V",
                  },
                  {
                    qText: "146.41803",
                    qNum: 146.41803278688528,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(255,254,254)",
                          qNum: 4294967038,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4618446.8",
                    qNum: 4618446.800000003,
                    qType: "V",
                  },
                  {
                    qText: "441.71444",
                    qNum: 441.71444444444376,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(2,34,36)",
                          qNum: 4278329892,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11278911.38",
                    qNum: 11278911.38000002,
                    qType: "V",
                  },
                  {
                    qText: "1887.8897",
                    qNum: 1887.8897058823534,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(136,148,123)",
                          qNum: 4287140987,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "15301203.64",
                    qNum: 15301203.640000004,
                    qType: "V",
                  },
                  {
                    qText: "90.431452",
                    qNum: 90.43145161290323,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(190,251,195)",
                          qNum: 4290706371,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6297529.79",
                    qNum: 6297529.790000005,
                    qType: "V",
                  },
                  {
                    qText: "698.36402",
                    qNum: 698.3640170940163,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(120,143,145)",
                          qNum: 4286091153,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "29426122.24",
                    qNum: 29426122.239999976,
                    qType: "V",
                  },
                  {
                    qText: "75.707586",
                    qNum: 75.70758620689655,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(237,141,14)",
                          qNum: 4293758222,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "674669.37",
                    qNum: 674669.3700000002,
                    qType: "V",
                  },
                  {
                    qText: "687.24058",
                    qNum: 687.2405766621437,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(7,6,7)",
                          qNum: 4278650375,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "32896084.55",
                    qNum: 32896084.54999995,
                    qType: "V",
                  },
                  {
                    qText: "72.786429",
                    qNum: 72.78642857142857,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(24,28,20)",
                          qNum: 4279770132,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2860906.95",
                    qNum: 2860906.9499999983,
                    qType: "V",
                  },
                  {
                    qText: "441.94563",
                    qNum: 441.9456262833674,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(242,230,254)",
                          qNum: 4294108926,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "15450026.19",
                    qNum: 15450026.190000013,
                    qType: "V",
                  },
                  {
                    qText: "296.62451",
                    qNum: 296.6245116279071,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(14,37,3)",
                          qNum: 4279117059,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8732568.26",
                    qNum: 8732568.260000017,
                    qType: "V",
                  },
                  {
                    qText: "690.85142",
                    qNum: 690.8514222222219,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(38,17,39)",
                          qNum: 4280684839,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8316552.7",
                    qNum: 8316552.700000007,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "53291.89",
                    qNum: 53291.89,
                    qType: "V",
                  },
                  {
                    qText: "628.24471",
                    qNum: 628.2447055137874,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(79,122,42)",
                          qNum: 4283398698,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "38711814.15",
                    qNum: 38711814.150000006,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "179.01182",
                    qNum: 179.0118181818182,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(202,238,253)",
                          qNum: 4291489533,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5804341.11",
                    qNum: 5804341.110000001,
                    qType: "V",
                  },
                  {
                    qText: "786.38932",
                    qNum: 786.3893181818183,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(235,151,124)",
                          qNum: 4293629820,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3946493.16",
                    qNum: 3946493.1600000006,
                    qType: "V",
                  },
                  {
                    qText: "634.54494",
                    qNum: 634.5449431818183,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(200,222,244)",
                          qNum: 4291354356,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "7537045.15",
                    qNum: 7537045.150000009,
                    qType: "V",
                  },
                  {
                    qText: "143.29983",
                    qNum: 143.2998316498317,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(7,153,239)",
                          qNum: 4278688239,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8555342.78",
                    qNum: 8555342.780000016,
                    qType: "V",
                  },
                  {
                    qText: "560.14651",
                    qNum: 560.1465149136578,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(255,253,238)",
                          qNum: 4294966766,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12244539.33",
                    qNum: 12244539.330000017,
                    qType: "V",
                  },
                  {
                    qText: "986.64782",
                    qNum: 986.6478186274511,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(242,245,164)",
                          qNum: 4294112676,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9553906.51",
                    qNum: 9553906.510000013,
                    qType: "V",
                  },
                  {
                    qText: "330.48471",
                    qNum: 330.48470588235284,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(189,186,193)",
                          qNum: 4290624193,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8919358.23",
                    qNum: 8919358.230000013,
                    qType: "V",
                  },
                  {
                    qText: "447.44001",
                    qNum: 447.44001182033134,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(164,136,133)",
                          qNum: 4288972933,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "26305888.12",
                    qNum: 26305888.119999968,
                    qType: "V",
                  },
                  {
                    qText: "215.52923",
                    qNum: 215.52923076923085,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(186,152,186)",
                          qNum: 4290418874,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2684532.36",
                    qNum: 2684532.36,
                    qType: "V",
                  },
                  {
                    qText: "462.51588",
                    qNum: 462.51588148148136,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(33,76,82)",
                          qNum: 4280372306,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12775055.85",
                    qNum: 12775055.850000018,
                    qType: "V",
                  },
                  {
                    qText: "1313.6266",
                    qNum: 1313.6265895953761,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(141,16,76)",
                          qNum: 4287434828,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "16699185.42",
                    qNum: 16699185.42000001,
                    qType: "V",
                  },
                  {
                    qText: "93.920776",
                    qNum: 93.92077586206898,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(107,190,197)",
                          qNum: 4285251269,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8734674.73",
                    qNum: 8734674.730000006,
                    qType: "V",
                  },
                  {
                    qText: "799.12789",
                    qNum: 799.1278935185184,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(223,229,236)",
                          qNum: 4292863468,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "18202947.77",
                    qNum: 18202947.769999985,
                    qType: "V",
                  },
                  {
                    qText: "121.13375",
                    qNum: 121.13375,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(226,225,226)",
                          qNum: 4293059042,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "761210.91",
                    qNum: 761210.91,
                    qType: "V",
                  },
                  {
                    qText: "374.8906",
                    qNum: 374.890604249668,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(197,213,182)",
                          qNum: 4291155382,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "30575373.01",
                    qNum: 30575373.00999995,
                    qType: "V",
                  },
                  {
                    qText: "67.407708",
                    qNum: 67.40770833333332,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(171,194,188)",
                          qNum: 4289446588,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "16630098.33",
                    qNum: 16630098.330000006,
                    qType: "V",
                  },
                  {
                    qText: "372.17262",
                    qNum: 372.1726156941648,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(149,140,114)",
                          qNum: 4287990898,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "32668540.32",
                    qNum: 32668540.31999993,
                    qType: "V",
                  },
                  {
                    qText: "406.10046",
                    qNum: 406.10046082949304,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(249,194,253)",
                          qNum: 4294558461,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "7178390.23",
                    qNum: 7178390.229999999,
                    qType: "V",
                  },
                  {
                    qText: "1628.6552",
                    qNum: 1628.6552118644067,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(62,135,166)",
                          qNum: 4282288038,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5384023.32",
                    qNum: 5384023.319999998,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "592.1546",
                    qNum: 592.1545955184207,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(90,184,176)",
                          qNum: 4284135600,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "37364801.87",
                    qNum: 37364801.86999999,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "319.39455",
                    qNum: 319.3945454545455,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(46,59,61)",
                          qNum: 4281219901,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "1016271.51",
                    qNum: 1016271.5100000002,
                    qType: "V",
                  },
                  {
                    qText: "1129.6646",
                    qNum: 1129.6645578231298,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(34,13,196)",
                          qNum: 4280421828,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9573343.05",
                    qNum: 9573343.05000001,
                    qType: "V",
                  },
                  {
                    qText: "878.59498",
                    qNum: 878.5949765258218,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(156,41,173)",
                          qNum: 4288424365,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9914881.77",
                    qNum: 9914881.770000014,
                    qType: "V",
                  },
                  {
                    qText: "229.14459",
                    qNum: 229.14459016393442,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(14,50,42)",
                          qNum: 4279120426,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5961213.3",
                    qNum: 5961213.300000004,
                    qType: "V",
                  },
                  {
                    qText: "270.23649",
                    qNum: 270.2364852941176,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(15,12,12)",
                          qNum: 4279176204,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11786781.47",
                    qNum: 11786781.470000017,
                    qType: "V",
                  },
                  {
                    qText: "272.95286",
                    qNum: 272.9528638497652,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(187,198,118)",
                          qNum: 4290496118,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8319847.04",
                    qNum: 8319847.0400000075,
                    qType: "V",
                  },
                  {
                    qText: "139.38178",
                    qNum: 139.3817777777778,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(59,64,64)",
                          qNum: 4282073152,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6329609.79",
                    qNum: 6329609.790000005,
                    qType: "V",
                  },
                  {
                    qText: "497.01106",
                    qNum: 497.0110628019321,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(222,244,222)",
                          qNum: 4292801758,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "15594850.78",
                    qNum: 15594850.780000018,
                    qType: "V",
                  },
                  {
                    qText: "318.63932",
                    qNum: 318.6393181818182,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(197,189,224)",
                          qNum: 4291149280,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3056915.57",
                    qNum: 3056915.5700000003,
                    qType: "V",
                  },
                  {
                    qText: "424.27405",
                    qNum: 424.2740545144805,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(71,73,71)",
                          qNum: 4282861895,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9437414.95",
                    qNum: 9437414.95000002,
                    qType: "V",
                  },
                  {
                    qText: "1109.5924",
                    qNum: 1109.5924382207575,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(187,198,167)",
                          qNum: 4290496167,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11453260.53",
                    qNum: 11453260.53000001,
                    qType: "V",
                  },
                  {
                    qText: "102.68581",
                    qNum: 102.6858088235294,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(231,157,233)",
                          qNum: 4293369321,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10390136.66",
                    qNum: 10390136.660000008,
                    qType: "V",
                  },
                  {
                    qText: "715.64318",
                    qNum: 715.6431818181815,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(246,251,237)",
                          qNum: 4294376429,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11711229.2",
                    qNum: 11711229.200000009,
                    qType: "V",
                  },
                  {
                    qText: "76.272759",
                    qNum: 76.27275862068964,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(81,119,12)",
                          qNum: 4283528972,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "1057254.07",
                    qNum: 1057254.0700000005,
                    qType: "V",
                  },
                  {
                    qText: "1003.4332",
                    qNum: 1003.4331550068582,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(239,172,244)",
                          qNum: 4293897460,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13317271.06",
                    qNum: 13317271.060000021,
                    qType: "V",
                  },
                  {
                    qText: "89.730278",
                    qNum: 89.73027777777776,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(137,246,194)",
                          qNum: 4287231682,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2565158.02",
                    qNum: 2565158.0199999996,
                    qType: "V",
                  },
                  {
                    qText: "378.07504",
                    qNum: 378.0750416281222,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,22,115)",
                          qNum: 4278195827,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "10632393.31",
                    qNum: 10632393.31000002,
                    qType: "V",
                  },
                  {
                    qText: "371.99082",
                    qNum: 371.99081730769217,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(162,155,166)",
                          qNum: 4288846758,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6420773.13",
                    qNum: 6420773.1300000055,
                    qType: "V",
                  },
                  {
                    qText: "1691.2508",
                    qNum: 1691.2507762557073,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(177,157,176)",
                          qNum: 4289830320,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8433630.76",
                    qNum: 8433630.760000007,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "53291.89",
                    qNum: 53291.89,
                    qType: "V",
                  },
                  {
                    qText: "626.10161",
                    qNum: 626.1016102228366,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(239,235,218)",
                          qNum: 4293913562,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "24224988.33",
                    qNum: 24224988.329999942,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "187.04483",
                    qNum: 187.04482758620688,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(231,231,231)",
                          qNum: 4293388263,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2511980.4",
                    qNum: 2511980.4000000004,
                    qType: "V",
                  },
                  {
                    qText: "371.85284",
                    qNum: 371.8528448275863,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(170,238,157)",
                          qNum: 4289392285,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4441638.65",
                    qNum: 4441638.65,
                    qType: "V",
                  },
                  {
                    qText: "334.89124",
                    qNum: 334.89124137931043,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(82,74,74)",
                          qNum: 4283583050,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4554741.37",
                    qNum: 4554741.370000001,
                    qType: "V",
                  },
                  {
                    qText: "161.11319",
                    qNum: 161.1131877729259,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(102,174,116)",
                          qNum: 4284919412,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5390782.27",
                    qNum: 5390782.270000001,
                    qType: "V",
                  },
                  {
                    qText: "309.32207",
                    qNum: 309.3220678513732,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(220,220,220)",
                          qNum: 4292664540,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "16761513.8",
                    qNum: 16761513.800000006,
                    qType: "V",
                  },
                  {
                    qText: "884.98755",
                    qNum: 884.9875535168203,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(13,47,39)",
                          qNum: 4279054119,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "8792032.47",
                    qNum: 8792032.47000001,
                    qType: "V",
                  },
                  {
                    qText: "322.79553",
                    qNum: 322.7955319148935,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(101,86,200)",
                          qNum: 4284831432,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4340495.2",
                    qNum: 4340495.199999999,
                    qType: "V",
                  },
                  {
                    qText: "562.8339",
                    qNum: 562.8339027777781,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(229,251,226)",
                          qNum: 4293262306,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "33610353.15",
                    qNum: 33610353.14999997,
                    qType: "V",
                  },
                  {
                    qText: "186.989",
                    qNum: 186.989,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(134,87,253)",
                          qNum: 4286994429,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "1295434.88",
                    qNum: 1295434.8799999994,
                    qType: "V",
                  },
                  {
                    qText: "369.06583",
                    qNum: 369.0658304498271,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(234,248,216)",
                          qNum: 4293589208,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "14762139.97",
                    qNum: 14762139.970000014,
                    qType: "V",
                  },
                  {
                    qText: "1013.9487",
                    qNum: 1013.9487003058109,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(187,209,233)",
                          qNum: 4290499049,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "16292026.73",
                    qNum: 16292026.729999993,
                    qType: "V",
                  },
                  {
                    qText: "137.1133",
                    qNum: 137.1133043478261,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(165,217,81)",
                          qNum: 4289059153,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5986224.23",
                    qNum: 5986224.2299999995,
                    qType: "V",
                  },
                  {
                    qText: "1026.215",
                    qNum: 1026.2150000000001,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(58,168,33)",
                          qNum: 4282034209,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "28699061.61",
                    qNum: 28699061.60999998,
                    qType: "V",
                  },
                  {
                    qText: "906.89595",
                    qNum: 906.8959459459462,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(242,245,219)",
                          qNum: 4294112731,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "1291169.85",
                    qNum: 1291169.8499999992,
                    qType: "V",
                  },
                  {
                    qText: "1070.8071",
                    qNum: 1070.8071226765783,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(210,137,227)",
                          qNum: 4291987939,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "29497164.72",
                    qNum: 29497164.719999954,
                    qType: "V",
                  },
                  {
                    qText: "75.151961",
                    qNum: 75.1519607843137,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(57,28,189)",
                          qNum: 4281932989,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12326843.05",
                    qNum: 12326843.050000004,
                    qType: "V",
                  },
                  {
                    qText: "349.06145",
                    qNum: 349.06145054945006,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(82,27,234)",
                          qNum: 4283571178,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "28328343.47",
                    qNum: 28328343.46999996,
                    qType: "V",
                  },
                  {
                    qText: "515.13807",
                    qNum: 515.1380748663101,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(216,215,245)",
                          qNum: 4292401141,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "18876649.18",
                    qNum: 18876649.17999999,
                    qType: "V",
                  },
                  {
                    qText: "1382.8114",
                    qNum: 1382.811388888889,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(219,236,245)",
                          qNum: 4292603125,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5674985.31",
                    qNum: 5674985.310000006,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "53291.89",
                    qNum: 53291.89,
                    qType: "V",
                  },
                  {
                    qText: "692.47466",
                    qNum: 692.4746589776479,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(144,85,142)",
                          qNum: 4287649166,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "41886855.03",
                    qNum: 41886855.02999999,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "236.96443",
                    qNum: 236.96442622950823,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(150,211,245)",
                          qNum: 4288074741,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4065268.65",
                    qNum: 4065268.65,
                    qType: "V",
                  },
                  {
                    qText: "1813.1842",
                    qNum: 1813.1842241379297,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(249,244,224)",
                          qNum: 4294571232,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11407750.62",
                    qNum: 11407750.620000005,
                    qType: "V",
                  },
                  {
                    qText: "1269.9672",
                    qNum: 1269.9672316384167,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(246,245,246)",
                          qNum: 4294374902,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11716634.01",
                    qNum: 11716634.010000007,
                    qType: "V",
                  },
                  {
                    qText: "272.72272",
                    qNum: 272.7227184466019,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(173,181,170)",
                          qNum: 4289574314,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5180859.62",
                    qNum: 5180859.620000001,
                    qType: "V",
                  },
                  {
                    qText: "495.87",
                    qNum: 495.87000000000035,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(129,120,127)",
                          qNum: 4286675071,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "25971676.27",
                    qNum: 25971676.269999966,
                    qType: "V",
                  },
                  {
                    qText: "362.60147",
                    qNum: 362.6014705882351,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(5,16,7)",
                          qNum: 4278521863,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9196226.93",
                    qNum: 9196226.930000005,
                    qType: "V",
                  },
                  {
                    qText: "198.08011",
                    qNum: 198.08010989010995,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(59,56,66)",
                          qNum: 4282071106,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "6633057.85",
                    qNum: 6633057.850000006,
                    qType: "V",
                  },
                  {
                    qText: "587.75634",
                    qNum: 587.7563392857143,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(145,59,153)",
                          qNum: 4287708057,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "27664337.04",
                    qNum: 27664337.039999932,
                    qType: "V",
                  },
                  {
                    qText: "502.45231",
                    qNum: 502.4523076923076,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(173,200,165)",
                          qNum: 4289579173,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "2887295.65",
                    qNum: 2887295.6499999994,
                    qType: "V",
                  },
                  {
                    qText: "559.76975",
                    qNum: 559.7697505197501,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(225,151,102)",
                          qNum: 4292974438,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "17814427.38",
                    qNum: 17814427.379999995,
                    qType: "V",
                  },
                  {
                    qText: "1418.8464",
                    qNum: 1418.8463686131388,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(253,253,253)",
                          qNum: 4294835709,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "26985480.12",
                    qNum: 26985480.11999996,
                    qType: "V",
                  },
                  {
                    qText: "145.40155",
                    qNum: 145.40154639175256,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(66,80,8)",
                          qNum: 4282535944,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5685527.87",
                    qNum: 5685527.869999999,
                    qType: "V",
                  },
                  {
                    qText: "827.65482",
                    qNum: 827.654819427148,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(80,233,52)",
                          qNum: 4283492660,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "26325430.02",
                    qNum: 26325430.019999955,
                    qType: "V",
                  },
                  {
                    qText: "213.15333",
                    qNum: 213.1533333333333,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(216,234,237)",
                          qNum: 4292405997,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "507147.13",
                    qNum: 507147.13000000006,
                    qType: "V",
                  },
                  {
                    qText: "811.2717",
                    qNum: 811.2717047308323,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(220,221,221)",
                          qNum: 4292664797,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "16757291.28",
                    qNum: 16757291.28000001,
                    qType: "V",
                  },
                  {
                    qText: "107.36037",
                    qNum: 107.36037037037033,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(195,242,242)",
                          qNum: 4291031794,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "3093636",
                    qNum: 3093635.9999999995,
                    qType: "V",
                  },
                  {
                    qText: "411.12643",
                    qNum: 411.12643268124305,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(249,89,83)",
                          qNum: 4294531411,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13519821.5",
                    qNum: 13519821.50000001,
                    qType: "V",
                  },
                  {
                    qText: "372.28092",
                    qNum: 372.2809248554912,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(202,234,184)",
                          qNum: 4291488440,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "4718543.27",
                    qNum: 4718543.270000002,
                    qType: "V",
                  },
                  {
                    qText: "2126.9623",
                    qNum: 2126.9623497267758,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(26,89,56)",
                          qNum: 4279916856,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5537507.47",
                    qNum: 5537507.470000003,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "717.68592",
                    qNum: 717.6859159950403,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(207,247,234)",
                          qNum: 4291819498,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "40219374.22",
                    qNum: 40219374.22,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "269.14829",
                    qNum: 269.1482853025936,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(251,251,252)",
                          qNum: 4294704124,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12192121.77",
                    qNum: 12192121.770000014,
                    qType: "V",
                  },
                  {
                    qText: "955.56893",
                    qNum: 955.5689304461938,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(214,132,154)",
                          qNum: 4292248730,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "21175582.16",
                    qNum: 21175582.15999996,
                    qType: "V",
                  },
                  {
                    qText: "740.79169",
                    qNum: 740.7916862037886,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(110,120,127)",
                          qNum: 4285429887,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "21934757.63",
                    qNum: 21934757.629999958,
                    qType: "V",
                  },
                  {
                    qText: "176.17208",
                    qNum: 176.17207865168467,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(239,247,242)",
                          qNum: 4293916658,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "18177751.59",
                    qNum: 18177751.58999999,
                    qType: "V",
                  },
                  {
                    qText: "566.81297",
                    qNum: 566.8129733887074,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(252,243,219)",
                          qNum: 4294767579,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "37658133.06",
                    qNum: 37658133.05999998,
                    qType: "V",
                  },
                  {
                    qText: "657.96416",
                    qNum: 657.9641589523571,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(120,112,91)",
                          qNum: 4286083163,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "25444270.91",
                    qNum: 25444270.90999996,
                    qType: "V",
                  },
                  {
                    qText: "502.48339",
                    qNum: 502.48338582677155,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(69,24,10)",
                          qNum: 4282718218,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "18328287.31",
                    qNum: 18328287.309999973,
                    qType: "V",
                  },
                  {
                    qText: "504.90818",
                    qNum: 504.9081842359761,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(172,168,107)",
                          qNum: 4289505387,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "42755957.18",
                    qNum: 42755957.180000015,
                    qType: "V",
                  },
                  {
                    qText: "443.93759",
                    qNum: 443.93758754863813,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(8,59,48)",
                          qNum: 4278729520,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "13288353.78",
                    qNum: 13288353.780000016,
                    qType: "V",
                  },
                  {
                    qText: "445.37216",
                    qNum: 445.37215674806345,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(24,12,7)",
                          qNum: 4279766023,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "29617910.02",
                    qNum: 29617910.019999918,
                    qType: "V",
                  },
                  {
                    qText: "1465.9811",
                    qNum: 1465.981128914773,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(213,161,238)",
                          qNum: 4292190702,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "43646094.57",
                    qNum: 43646094.57000004,
                    qType: "V",
                  },
                  {
                    qText: "122.94226",
                    qNum: 122.94226315789486,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(99,159,167)",
                          qNum: 4284719015,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "18225752.86",
                    qNum: 18225752.85999998,
                    qType: "V",
                  },
                  {
                    qText: "798.62755",
                    qNum: 798.627551910297,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(131,178,42)",
                          qNum: 4286820906,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "41212225.74",
                    qNum: 41212225.740000024,
                    qType: "V",
                  },
                  {
                    qText: "231.7759",
                    qNum: 231.77589958159,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(216,69,15)",
                          qNum: 4292363535,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "5978428.53",
                    qNum: 5978428.529999999,
                    qType: "V",
                  },
                  {
                    qText: "692.93311",
                    qNum: 692.9331091362402,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(26,43,230)",
                          qNum: 4279905254,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "43380012.79",
                    qNum: 43380012.79000002,
                    qType: "V",
                  },
                  {
                    qText: "84.293162",
                    qNum: 84.29316195372768,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(21,113,226)",
                          qNum: 4279595490,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "21450107.3",
                    qNum: 21450107.299999986,
                    qType: "V",
                  },
                  {
                    qText: "362.66315",
                    qNum: 362.6631456548346,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(157,188,183)",
                          qNum: 4288527543,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "40070532.78",
                    qNum: 40070532.780000016,
                    qType: "V",
                  },
                  {
                    qText: "389.00698",
                    qNum: 389.006982097187,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(168,168,169)",
                          qNum: 4289243305,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "31244911.95",
                    qNum: 31244911.949999962,
                    qType: "V",
                  },
                  {
                    qText: "1081.0451",
                    qNum: 1081.0450712530671,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(101,29,48)",
                          qNum: 4284816688,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "20772308.61",
                    qNum: 20772308.609999973,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "53291.89",
                    qNum: 53291.89,
                    qType: "V",
                  },
                  {
                    qText: "643.30886",
                    qNum: 643.3088581607146,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(63,234,79)",
                          qNum: 4282378831,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "45731242.95",
                    qNum: 45731242.95,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "478.67935",
                    qNum: 478.6793467336685,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(157,42,160)",
                          qNum: 4288490144,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "20173793.31",
                    qNum: 20173793.30999999,
                    qType: "V",
                  },
                  {
                    qText: "1423.2052",
                    qNum: 1423.2051882845171,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(147,127,229)",
                          qNum: 4287856613,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "25520224.82",
                    qNum: 25520224.819999956,
                    qType: "V",
                  },
                  {
                    qText: "1145.5676",
                    qNum: 1145.5676070901018,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(7,7,6)",
                          qNum: 4278650630,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "28314766.43",
                    qNum: 28314766.429999933,
                    qType: "V",
                  },
                  {
                    qText: "219.85178",
                    qNum: 219.85177762982673,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(78,60,65)",
                          qNum: 4283317313,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "42368178.74",
                    qNum: 42368178.73999997,
                    qType: "V",
                  },
                  {
                    qText: "1015.2858",
                    qNum: 1015.2858052256546,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(97,74,88)",
                          qNum: 4284566104,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "37740245.34",
                    qNum: 37740245.339999974,
                    qType: "V",
                  },
                  {
                    qText: "1420.8924",
                    qNum: 1420.8923722883155,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(83,83,149)",
                          qNum: 4283650965,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "39573667.43",
                    qNum: 39573667.42999996,
                    qType: "V",
                  },
                  {
                    qText: "619.00534",
                    qNum: 619.005340393343,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(20,95,28)",
                          qNum: 4279525148,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "37245289.39",
                    qNum: 37245289.38999996,
                    qType: "V",
                  },
                  {
                    qText: "634.62527",
                    qNum: 634.6252728400177,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(164,246,185)",
                          qNum: 4289001145,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "40211449.22",
                    qNum: 40211449.21999999,
                    qType: "V",
                  },
                  {
                    qText: "96.734573",
                    qNum: 96.73457317073168,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(42,135,226)",
                          qNum: 4280977378,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "19078812.68",
                    qNum: 19078812.68,
                    qType: "V",
                  },
                  {
                    qText: "816.6702",
                    qNum: 816.6702017220218,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(221,221,216)",
                          qNum: 4292730328,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "39547577.44",
                    qNum: 39547577.43999995,
                    qType: "V",
                  },
                  {
                    qText: "2056.9899",
                    qNum: 2056.9898707515645,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(129,250,148)",
                          qNum: 4286708372,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "43095471.74",
                    qNum: 43095471.740000024,
                    qType: "V",
                  },
                  {
                    qText: "172.43043",
                    qNum: 172.43042929292946,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(161,241,165)",
                          qNum: 4288803237,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "34091306.95",
                    qNum: 34091306.94999991,
                    qType: "V",
                  },
                  {
                    qText: "848.55317",
                    qNum: 848.5531652360506,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(243,242,246)",
                          qNum: 4294177526,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "42063201.57",
                    qNum: 42063201.56999999,
                    qType: "V",
                  },
                  {
                    qText: "382.98118",
                    qNum: 382.9811818181817,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(241,254,244)",
                          qNum: 4294049524,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "9227411.16",
                    qNum: 9227411.16000001,
                    qType: "V",
                  },
                  {
                    qText: "1074.999",
                    qNum: 1074.9989943892922,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(215,219,244)",
                          qNum: 4292336628,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "45651735.56",
                    qNum: 45651735.55999999,
                    qType: "V",
                  },
                  {
                    qText: "108.61213",
                    qNum: 108.61212962962964,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(14,30,68)",
                          qNum: 4279115332,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "11526671.43",
                    qNum: 11526671.430000009,
                    qType: "V",
                  },
                  {
                    qText: "423.98752",
                    qNum: 423.9875220541896,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(165,145,145)",
                          qNum: 4289040785,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "41736168",
                    qNum: 41736168.00000001,
                    qType: "V",
                  },
                  {
                    qText: "417.82772",
                    qNum: 417.82771696638036,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(1,8,4)",
                          qNum: 4278257668,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "23027846.67",
                    qNum: 23027846.669999976,
                    qType: "V",
                  },
                  {
                    qText: "1404.6198",
                    qNum: 1404.6197580645144,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(143,12,179)",
                          qNum: 4287564979,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "34848960.96",
                    qNum: 34848960.95999994,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "931.07573",
                    qNum: 931.0757322513505,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(37,14,62)",
                          qNum: 4280618558,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "46258458.11",
                    qNum: 46258458.110000014,
                    qType: "V",
                  },
                ],
                [
                  {
                    qText: "345.51583",
                    qNum: 345.51583333333423,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(66,55,189)",
                          qNum: 4282529725,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "25198529.46",
                    qNum: 25198529.45999994,
                    qType: "V",
                  },
                  {
                    qText: "1135.8352",
                    qNum: 1135.8351653225745,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(133,218,242)",
                          qNum: 4286962418,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "29460532.68",
                    qNum: 29460532.679999933,
                    qType: "V",
                  },
                  {
                    qText: "894.22578",
                    qNum: 894.2257838745734,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(254,252,251)",
                          qNum: 4294900987,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "31977963.22",
                    qNum: 31977963.219999917,
                    qType: "V",
                  },
                  {
                    qText: "191.89761",
                    qNum: 191.8976078619376,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(30,38,40)",
                          qNum: 4280165928,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "43964310.09",
                    qNum: 43964310.089999996,
                    qType: "V",
                  },
                  {
                    qText: "743.08696",
                    qNum: 743.0869554663434,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(42,41,4)",
                          qNum: 4280953092,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "43425574.5",
                    qNum: 43425574.50000001,
                    qType: "V",
                  },
                  {
                    qText: "957.18865",
                    qNum: 957.1886455331397,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(122,151,173)",
                          qNum: 4286224301,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "45519720.97",
                    qNum: 45519720.97000001,
                    qType: "V",
                  },
                  {
                    qText: "545.17796",
                    qNum: 545.1779600886904,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(163,232,203)",
                          qNum: 4288932043,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "42251290.51",
                    qNum: 42251290.510000005,
                    qType: "V",
                  },
                  {
                    qText: "552.77785",
                    qNum: 552.7778466819265,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(41,36,38)",
                          qNum: 4280886310,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "46169928.44",
                    qNum: 46169928.44,
                    qType: "V",
                  },
                  {
                    qText: "308.68511",
                    qNum: 308.685106888361,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(40,83,23)",
                          qNum: 4280832791,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "23734607.63",
                    qNum: 23734607.62999996,
                    qType: "V",
                  },
                  {
                    qText: "583.79169",
                    qNum: 583.7916865370527,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(168,197,55)",
                          qNum: 4289250615,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "45851206.03",
                    qNum: 45851206.030000016,
                    qType: "V",
                  },
                  {
                    qText: "1689.5829",
                    qNum: 1689.5829149687647,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(28,9,54)",
                          qNum: 4280027446,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "46013046.83",
                    qNum: 46013046.83,
                    qType: "V",
                  },
                  {
                    qText: "141.41287",
                    qNum: 141.41286993402463,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(90,88,54)",
                          qNum: 4284110902,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "40856871.5",
                    qNum: 40856871.49999998,
                    qType: "V",
                  },
                  {
                    qText: "818.78815",
                    qNum: 818.7881548650605,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(72,85,188)",
                          qNum: 4282930620,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "46044775.24",
                    qNum: 46044775.24000002,
                    qType: "V",
                  },
                  {
                    qText: "279.43372",
                    qNum: 279.43372492836676,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(49,38,44)",
                          qNum: 4281411116,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "12468614.12",
                    qNum: 12468614.120000012,
                    qType: "V",
                  },
                  {
                    qText: "835.09003",
                    qNum: 835.0900252920687,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(12,116,161)",
                          qNum: 4279006369,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "46070618.89",
                    qNum: 46070618.88999999,
                    qType: "V",
                  },
                  {
                    qText: "89.577767",
                    qNum: 89.57776659959794,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(36,57,48)",
                          qNum: 4280564016,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "27208226.92",
                    qNum: 27208226.919999983,
                    qType: "V",
                  },
                  {
                    qText: "385.60422",
                    qNum: 385.60422299487124,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(89,119,35)",
                          qNum: 4284053283,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "45638646.7",
                    qNum: 45638646.70000002,
                    qType: "V",
                  },
                  {
                    qText: "399.17573",
                    qNum: 399.1757324137933,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(229,247,243)",
                          qNum: 4293261299,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "41202525.22",
                    qNum: 41202525.220000006,
                    qType: "V",
                  },
                  {
                    qText: "1195.6466",
                    qNum: 1195.6465788638543,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(98,166,145)",
                          qNum: 4284655249,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "41724085.14",
                    qNum: 41724085.14000001,
                    qType: "V",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "53291.89",
                    qNum: 53291.89,
                    qType: "V",
                  },
                  {
                    qText: "751.94594",
                    qNum: 751.9459353162317,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(55,34,58)",
                          qNum: 4281803322,
                        },
                        {
                          qText: "RGB(255,255,0)",
                          qNum: 4294967040,
                        },
                      ],
                    },
                  },
                  {
                    qText: "46258458.11",
                    qNum: 46258458.110000014,
                    qType: "V",
                  },
                ],
              ],
              qArea: {
                qLeft: 0,
                qTop: 0,
                qWidth: 42,
                qHeight: 15,
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
        subtitle: "2 row, 2 columns, pseudo dim as last column. Expanded cells. Color by expression. Totals below.",
        footnote: "",
        disableNavMenu: false,
        showDetails: true,
        showDetailsExpression: false,
        components: [
          {
            key: "general",
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

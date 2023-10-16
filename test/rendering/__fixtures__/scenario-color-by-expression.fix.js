export default () => ({
  type: "sn-pivot-table",
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: "HdwCJqK",
          qType: "sn-pivot-table",
        },
        qMeta: {
          privileges: ["read", "update", "delete"],
        },
        qSelectionInfo: {
          qInSelections: false,
          qMadeSelections: false,
        },
        qHyperCube: {
          qSize: {
            qcx: 14,
            qcy: 14,
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
              qAttrExprInfo: [
                {
                  qMin: 4278212330,
                  qMax: 4278321666,
                  qFallbackTitle: "hsl(rand(), rand(), rand())",
                  qMinText: "RGB(0,86,234)",
                  qMaxText: "RGB(2,2,2)",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "cellBackgroundColor",
                },
              ],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 2,
                qHypercubeCardinal: 2,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "7cd6768c-03dc-42d7-b6d0-02b6b25d38fd",
              title: "Year",
              cId: "oli5ut",
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
                qOption: 9,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 3,
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
              qMax: 11,
              qAttrExprInfo: [
                {
                  qMin: 108431942,
                  qMax: 3595650666,
                  qFallbackTitle: "argb(rand()*255, rand()*255, rand()*255, rand()*255)",
                  qMinText: "ARGB(6,118,138,70)",
                  qMaxText: "ARGB(214,81,70,106)",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "cellBackgroundColor",
                },
              ],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 12,
                qHypercubeCardinal: 9,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "KHvcSGE",
              title: "Month",
              cId: "p0itt1",
            },
            {
              qFallbackTitle: "Product",
              qApprMaxGlyphCount: 48,
              qCardinal: 7942,
              qSortIndicator: "A",
              qGroupFallbackTitles: ["Product"],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 7,
                qOption: 0,
                qDeselected: 0,
                qAlternative: 7935,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0,
              },
              qTags: ["$key", "$ascii", "$text"],
              qDimensionType: "D",
              qGrouping: "N",
              qNumFormat: {
                qType: "U",
                qnDec: 0,
                qUseThou: 0,
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ["Line Desc 1"],
              qMin: "NaN",
              qMax: "NaN",
              qAttrExprInfo: [
                {
                  qMin: 4281491584,
                  qMax: 4294501609,
                  qFallbackTitle: "hsl(rand(), rand(), rand())",
                  qMinText: "RGB(50,96,128)",
                  qMaxText: "RGB(248,228,233)",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "cellBackgroundColor",
                },
              ],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 7942,
                qHypercubeCardinal: 7,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "14d98166-8e9d-46ba-974b-70fd83b29b91",
              title: "Product",
              cId: "b43eq1",
            },
          ],
          qMeasureInfo: [
            {
              qFallbackTitle: "Avg Sales",
              qApprMaxGlyphCount: 10,
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
              qMin: 0,
              qMax: 301.28000000000003,
              qIsAutoFormat: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qLibraryId: "LvjWKp",
              qTrendLines: [],
              cId: "aubg50",
            },
            {
              qFallbackTitle: "Actual Amount",
              qApprMaxGlyphCount: 10,
              qCardinal: 0,
              qSortIndicator: "D",
              qNumFormat: {
                qType: "U",
                qnDec: 0,
                qUseThou: 0,
              },
              qMin: 0,
              qMax: 1996743.4699999997,
              qIsAutoFormat: true,
              qAttrExprInfo: [
                {
                  qMin: 4278255360,
                  qMax: 4294901760,
                  qFallbackTitle: "If(Sum([Actual Amount]) > 0, lightgreen(), lightred())",
                  qMinText: "RGB(0,255,0)",
                  qMaxText: "RGB(255,0,0)",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "cellBackgroundColor",
                },
              ],
              qAttrDimInfo: [],
              qLibraryId: "vDhvSum",
              qTrendLines: [],
              coloring: {},
              autoSort: true,
              cId: "metgUK",
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
          qEffectiveInterColumnSortOrder: [0, 1, 2, -1],
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
                            qText: "ARGB(193,237,187,201)",
                            qNum: 3253582793,
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
                            qText: "ARGB(255,118,138,70)",
                            qNum: 108431942,
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
                            qText: "ARGB(189,139,225,120)",
                            qNum: 3180061048,
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
                            qText: "ARGB(160,110,242,48)",
                            qNum: 2691625520,
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
                            qText: "ARGB(111,202,28,102)",
                            qNum: 1875516518,
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
                            qText: "ARGB(94,224,169,4)",
                            qNum: 1591781636,
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
                            qText: "ARGB(136,141,125,107)",
                            qNum: 2290974059,
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
                            qText: "ARGB(89,178,97,102)",
                            qNum: 1504862566,
                          },
                        ],
                      },
                    },
                  ],
                  qAttrExps: {
                    qValues: [
                      {
                        qText: "RGB(2,2,2)",
                        qNum: 4278321666,
                      },
                    ],
                  },
                },
                {
                  qText: "2007",
                  qElemNo: 0,
                  qValue: 2007,
                  qCanCollapse: true,
                  qType: "N",
                  qUp: 0,
                  qDown: 0,
                  qSubNodes: [
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
                            qText: "ARGB(49,131,188,58)",
                            qNum: 830716986,
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
                            qText: "ARGB(214,81,70,106)",
                            qNum: 3595650666,
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
                            qText: "ARGB(165,152,215,45)",
                            qNum: 2778257197,
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
                            qText: "ARGB(19,104,18,22)",
                            qNum: 325587478,
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
                            qText: "ARGB(187,115,250,132)",
                            qNum: 3144940164,
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
                            qText: "ARGB(122,36,148,132)",
                            qNum: 2049217668,
                          },
                        ],
                      },
                    },
                  ],
                  qAttrExps: {
                    qValues: [
                      {
                        qText: "RGB(0,86,234)",
                        qNum: 4278212330,
                      },
                    ],
                  },
                },
              ],
              qTop: [
                {
                  qText: "Bill's American Low Fat Cole Slaw",
                  qElemNo: 7404,
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
                  qAttrExps: {
                    qValues: [
                      {
                        qText: "RGB(224,239,255)",
                        qNum: 4292931583,
                      },
                    ],
                  },
                },
                {
                  qText: "Bill's Blue Label Fancy Canned Anchovies",
                  qElemNo: 1165,
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
                  qAttrExps: {
                    qValues: [
                      {
                        qText: "RGB(133,157,198)",
                        qNum: 4286946758,
                      },
                    ],
                  },
                },
                {
                  qText: "Jennifer's Super Apple Jelly",
                  qElemNo: 3291,
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
                  qAttrExps: {
                    qValues: [
                      {
                        qText: "RGB(162,179,221)",
                        qNum: 4288852957,
                      },
                    ],
                  },
                },
                {
                  qText: "Jimmy's Medalist Ravioli",
                  qElemNo: 2635,
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
                  qAttrExps: {
                    qValues: [
                      {
                        qText: "RGB(248,228,233)",
                        qNum: 4294501609,
                      },
                    ],
                  },
                },
                {
                  qText: "Marty's Kiwi Lox",
                  qElemNo: 4114,
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
                  qAttrExps: {
                    qValues: [
                      {
                        qText: "RGB(119,93,74)",
                        qNum: 4286012746,
                      },
                    ],
                  },
                },
                {
                  qText: "Sal's Bravo Beef Soup",
                  qElemNo: 3607,
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
                  qAttrExps: {
                    qValues: [
                      {
                        qText: "RGB(50,96,128)",
                        qNum: 4281491584,
                      },
                    ],
                  },
                },
                {
                  qText: "Sue's Washington Strawberry Drink",
                  qElemNo: 1640,
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
                  qAttrExps: {
                    qValues: [
                      {
                        qText: "RGB(193,50,122)",
                        qNum: 4290851450,
                      },
                    ],
                  },
                },
              ],
              qData: [
                [
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(255,0,0)",
                          qNum: 4294901760,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "138097.76",
                    qNum: 138097.75999999998,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "192005.98",
                    qNum: 192005.97999999998,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "196162.23",
                    qNum: 196162.23,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
                  },
                  {
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(255,0,0)",
                          qNum: 4294901760,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
                  {
                    qText: "19.6",
                    qNum: 19.6,
                    qType: "V",
                  },
                  {
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(255,0,0)",
                          qNum: 4294901760,
                        },
                      ],
                    },
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(255,0,0)",
                          qNum: 4294901760,
                        },
                      ],
                    },
                  },
                ],
                [
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
                    qText: "0.85333333",
                    qNum: 0.8533333333333333,
                    qType: "V",
                  },
                  {
                    qText: "169134.33",
                    qNum: 169134.33000000005,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "3276.14",
                    qNum: 3276.1399999999994,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "1996743.47",
                    qNum: 1996743.4699999997,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                ],
                [
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "136859.48",
                    qNum: 136859.48,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "21581.85",
                    qNum: 21581.85,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "80.34",
                    qNum: 80.34,
                    qType: "V",
                  },
                  {
                    qText: "29870.65",
                    qNum: 29870.65,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "301.28",
                    qNum: 301.28000000000003,
                    qType: "V",
                  },
                  {
                    qText: "77832.21",
                    qNum: 77832.21000000002,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "22.8975",
                    qNum: 22.8975,
                    qType: "V",
                  },
                  {
                    qText: "368655.72",
                    qNum: 368655.72,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                  },
                  {
                    qText: "0",
                    qNum: 0,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(255,0,0)",
                          qNum: 4294901760,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "80.34",
                    qNum: 80.34,
                    qType: "V",
                  },
                  {
                    qText: "29870.65",
                    qNum: 29870.65,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
                [
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
                    qText: "301.28",
                    qNum: 301.28000000000003,
                    qType: "V",
                  },
                  {
                    qText: "77832.21",
                    qNum: 77832.21000000002,
                    qType: "V",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "RGB(0,255,0)",
                          qNum: 4278255360,
                        },
                      ],
                    },
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
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                  {
                    qText: "-",
                    qNum: "NaN",
                    qType: "U",
                  },
                ],
              ],
              qArea: {
                qLeft: 0,
                qTop: 0,
                qWidth: 14,
                qHeight: 14,
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
        title: "Color by expression",
        subtitle: "",
        footnote: "",
        disableNavMenu: false,
        showDetails: false,
        showDetailsExpression: false,
        components: [
          {
            key: "general",
            title: {
              subTitle: {
                fontStyle: ["", "bold", "italic", "underline"],
                fontFamily: "Abril Fatface, serif",
                fontSize: "10px",
              },
            },
          },
          {
            key: "theme",
          },
        ],
        nullValueRepresentation: {
          text: "-",
        },
        visualization: "sn-pivot-table",
        version: "2.1.0",
        extensionMeta: {
          translationKey: "",
          icon: "puzzle",
          iconChar: "puzzle",
          isLibraryItem: true,
          visible: true,
          name: "sn-pivot-table",
          description: "Pivot table supernova",
          template: "sn-pivot-table",
          iconPath:
            "M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z",
          isThirdParty: true,
          id: "vzXxEnfHORli6Q5NYgISeW0BqQOb_rco",
          tenantId: "So2tYBBh-SeC2uqq2ghwvPxTRS9ca45i",
          userId: "JPeb7TR-mlh0qq62wjemn0esUJBF90z9",
          type: "visualization",
          qextFilename: "sn-pivot-table",
          qextVersion: "2.1.0",
          loadpath: "sn-pivot-table",
          version: "20.0.0",
          author: "QlikTech International AB",
          tags: [],
          checksum: null,
          bundled: false,
          supernova: true,
          file: {
            contentType: "application/zip",
            contentLength: 147328,
            md5: "2c4839de66fbebeb345116e0e1b16301",
            fileId: "L4uxvuANAQERtwTkM0nVJg7q7k0DJVWg",
            originalname: "sn-pivot-table-ext.zip",
          },
          createdAt: "2023-08-23T05:48:42.860Z",
          updatedAt: "2023-09-22T08:31:00.945Z",
          cloud: true,
        },
        qHasSoftPatches: true,
      },
      getEffectiveProperties: {},
    },
  ],
});

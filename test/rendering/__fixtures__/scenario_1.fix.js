export default () => ({
  type: 'sn-pivot-table',
  genericObjects: [
    {
      getLayout: {
        'qInfo': {
          'qId': 'PpJQFv',
          'qType': 'sn-pivot-table'
        },
        'qMeta': {
          'privileges': [
            'read',
            'update',
            'delete',
            'exportdata'
          ]
        },
        'qSelectionInfo': {},
        'qHyperCube': {
          'qSize': {
            'qcx': 1,
            'qcy': 9
          },
          'qDimensionInfo': [
            {
              'qFallbackTitle': 'Dim1',
              'qApprMaxGlyphCount': 1,
              'qCardinal': 3,
              'qSortIndicator': 'A',
              'qGroupFallbackTitles': [
                'Dim1'
              ],
              'qGroupPos': 0,
              'qStateCounts': {
                'qLocked': 0,
                'qSelected': 0,
                'qOption': 3,
                'qDeselected': 0,
                'qAlternative': 0,
                'qExcluded': 0,
                'qSelectedExcluded': 0,
                'qLockedExcluded': 0
              },
              'qTags': [
                '$ascii',
                '$text'
              ],
              'qDimensionType': 'D',
              'qGrouping': 'N',
              'qNumFormat': {
                'qType': 'U',
                'qnDec': 0,
                'qUseThou': 0
              },
              'qIsAutoFormat': true,
              'qGroupFieldDefs': [
                'Dim1'
              ],
              'qMin': 'NaN',
              'qMax': 'NaN',
              'qAttrExprInfo': [],
              'qAttrDimInfo': [],
              'qCardinalities': {
                'qCardinal': 3,
                'qHypercubeCardinal': 3,
                'qAllValuesCardinal': -1
              },
              'autoSort': true,
              'cId': 'BPCmLu'
            },
            {
              'qFallbackTitle': 'Dim2',
              'qApprMaxGlyphCount': 1,
              'qCardinal': 6,
              'qSortIndicator': 'A',
              'qGroupFallbackTitles': [
                'Dim2'
              ],
              'qGroupPos': 0,
              'qStateCounts': {
                'qLocked': 0,
                'qSelected': 0,
                'qOption': 6,
                'qDeselected': 0,
                'qAlternative': 0,
                'qExcluded': 0,
                'qSelectedExcluded': 0,
                'qLockedExcluded': 0
              },
              'qTags': [
                '$ascii',
                '$text'
              ],
              'qDimensionType': 'D',
              'qGrouping': 'N',
              'qNumFormat': {
                'qType': 'U',
                'qnDec': 0,
                'qUseThou': 0
              },
              'qIsAutoFormat': true,
              'qGroupFieldDefs': [
                'Dim2'
              ],
              'qMin': 'NaN',
              'qMax': 'NaN',
              'qAttrExprInfo': [],
              'qAttrDimInfo': [],
              'qCardinalities': {
                'qCardinal': 6,
                'qHypercubeCardinal': 0,
                'qAllValuesCardinal': -1
              },
              'autoSort': true,
              'cId': 'VtXNUnt'
            }
          ],
          'qMeasureInfo': [
            {
              'qFallbackTitle': 'Sum(Expression1)',
              'qApprMaxGlyphCount': 6,
              'qCardinal': 0,
              'qSortIndicator': 'D',
              'qNumFormat': {
                'qType': 'I',
                'qnDec': 0,
                'qUseThou': 1,
                'qFmt': '###0',
                'qDec': '.'
              },
              'qMin': 27022,
              'qMax': 145362,
              'qIsAutoFormat': true,
              'qAttrExprInfo': [],
              'qAttrDimInfo': [],
              'qTrendLines': [],
              'autoSort': true,
              'cId': 'PCThM'
            },
            {
              'qFallbackTitle': 'Sum(Expression2)',
              'qApprMaxGlyphCount': 4,
              'qCardinal': 0,
              'qSortIndicator': 'D',
              'qNumFormat': {
                'qType': 'I',
                'qnDec': 0,
                'qUseThou': 1,
                'qFmt': '###0',
                'qDec': '.'
              },
              'qMin': 242,
              'qMax': 1427,
              'qIsAutoFormat': true,
              'qAttrExprInfo': [],
              'qAttrDimInfo': [],
              'qTrendLines': [],
              'autoSort': true,
              'cId': 'PLnJMPt'
            },
            {
              'qFallbackTitle': 'Sum(Expression3)',
              'qApprMaxGlyphCount': 9,
              'qCardinal': 0,
              'qSortIndicator': 'D',
              'qNumFormat': {
                'qType': 'F',
                'qnDec': 5,
                'qUseThou': 1,
                'qFmt': '###0.00000',
                'qDec': '.'
              },
              'qMin': 54.094440000000006,
              'qMax': 287.2068199999997,
              'qIsAutoFormat': true,
              'qAttrExprInfo': [],
              'qAttrDimInfo': [],
              'qTrendLines': [],
              'autoSort': true,
              'cId': 'uPyxdr'
            }
          ],
          'qEffectiveInterColumnSortOrder': [
            0,
            1,
            -1
          ],
          'qGrandTotalRow': [],
          'qDataPages': [],
          'qPivotDataPages': [
            {
              'qLeft': [
                {
                  'qText': 'A',
                  'qElemNo': 0,
                  'qValue': 'NaN',
                  'qCanExpand': true,
                  'qType': 'N',
                  'qUp': 0,
                  'qDown': 0,
                  'qSubNodes': [
                    {
                      'qText': 'Sum(Expression1)',
                      'qElemNo': 0,
                      'qValue': 'NaN',
                      'qType': 'P',
                      'qUp': 0,
                      'qDown': 0,
                      'qSubNodes': []
                    },
                    {
                      'qText': 'Sum(Expression2)',
                      'qElemNo': 1,
                      'qValue': 'NaN',
                      'qType': 'P',
                      'qUp': 0,
                      'qDown': 0,
                      'qSubNodes': []
                    },
                    {
                      'qText': 'Sum(Expression3)',
                      'qElemNo': 2,
                      'qValue': 'NaN',
                      'qType': 'P',
                      'qUp': 0,
                      'qDown': 0,
                      'qSubNodes': []
                    }
                  ]
                },
                {
                  'qText': 'B',
                  'qElemNo': 2,
                  'qValue': 'NaN',
                  'qCanExpand': true,
                  'qType': 'N',
                  'qUp': 0,
                  'qDown': 0,
                  'qSubNodes': [
                    {
                      'qText': 'Sum(Expression1)',
                      'qElemNo': 0,
                      'qValue': 'NaN',
                      'qType': 'P',
                      'qUp': 0,
                      'qDown': 0,
                      'qSubNodes': []
                    },
                    {
                      'qText': 'Sum(Expression2)',
                      'qElemNo': 1,
                      'qValue': 'NaN',
                      'qType': 'P',
                      'qUp': 0,
                      'qDown': 0,
                      'qSubNodes': []
                    },
                    {
                      'qText': 'Sum(Expression3)',
                      'qElemNo': 2,
                      'qValue': 'NaN',
                      'qType': 'P',
                      'qUp': 0,
                      'qDown': 0,
                      'qSubNodes': []
                    }
                  ]
                },
                {
                  'qText': 'C',
                  'qElemNo': 1,
                  'qValue': 'NaN',
                  'qCanExpand': true,
                  'qType': 'N',
                  'qUp': 0,
                  'qDown': 0,
                  'qSubNodes': [
                    {
                      'qText': 'Sum(Expression1)',
                      'qElemNo': 0,
                      'qValue': 'NaN',
                      'qType': 'P',
                      'qUp': 0,
                      'qDown': 0,
                      'qSubNodes': []
                    },
                    {
                      'qText': 'Sum(Expression2)',
                      'qElemNo': 1,
                      'qValue': 'NaN',
                      'qType': 'P',
                      'qUp': 0,
                      'qDown': 0,
                      'qSubNodes': []
                    },
                    {
                      'qText': 'Sum(Expression3)',
                      'qElemNo': 2,
                      'qValue': 'NaN',
                      'qType': 'P',
                      'qUp': 0,
                      'qDown': 0,
                      'qSubNodes': []
                    }
                  ]
                }
              ],
              'qTop': [],
              'qData': [
                [
                  {
                    'qText': '27022',
                    'qNum': 27022,
                    'qType': 'V'
                  }
                ],
                [
                  {
                    'qText': '242',
                    'qNum': 242,
                    'qType': 'V'
                  }
                ],
                [
                  {
                    'qText': '54.09444',
                    'qNum': 54.094440000000006,
                    'qType': 'V'
                  }
                ],
                [
                  {
                    'qText': '90312',
                    'qNum': 90312,
                    'qType': 'V'
                  }
                ],
                [
                  {
                    'qText': '872',
                    'qNum': 872,
                    'qType': 'V'
                  }
                ],
                [
                  {
                    'qText': '167.01061',
                    'qNum': 167.01061000000016,
                    'qType': 'V'
                  }
                ],
                [
                  {
                    'qText': '145362',
                    'qNum': 145362,
                    'qType': 'V'
                  }
                ],
                [
                  {
                    'qText': '1427',
                    'qNum': 1427,
                    'qType': 'V'
                  }
                ],
                [
                  {
                    'qText': '287.20682',
                    'qNum': 287.2068199999997,
                    'qType': 'V'
                  }
                ]
              ],
              'qArea': {
                'qLeft': 0,
                'qTop': 0,
                'qWidth': 1,
                'qHeight': 9
              }
            }
          ],
          'qStackedDataPages': [],
          'qMode': 'P',
          'qNoOfLeftDims': 3,
          'qTreeNodesOnDim': [],
          'qColumnOrder': []
        },
        'search': {
          'sorting': 'auto'
        },
        'showTitles': true,
        'title': 'Scenario 1',
        'subtitle': '',
        'footnote': '',
        'disableNavMenu': false,
        'showDetails': false,
        'showDetailsExpression': false,
        'nullValueRepresentation': {
          'text': '-'
        },
        'visualization': 'sn-pivot-table',
        'version': '0.2.0',
        'extensionMeta': {
          'translationKey': '',
          'icon': 'puzzle',
          'iconChar': 'puzzle',
          'isLibraryItem': true,
          'visible': true,
          'name': 'sn-pivot-table',
          'description': 'Pivot table supernova',
          'template': 'sn-pivot-table',
          'iconPath': 'M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z',
          'isThirdParty': true,
          'version': '0.2.0',
          'author': 'QlikTech International AB',
          'type': 'visualization',
          'supernova': true
        }
      }
    },
  ],
});

import connect from './connect';
import embed from './configure';
import './style.css';

(async () => {
  const app = await connect();
  const nuked = embed(app);

  nuked.selections().then((selections) => selections.mount(document.getElementById('selections')));

  // create a session object
  nuked.render({
    element: document.querySelector('.object'),
    type: 'pivot-table',
    properties: {
      qHyperCubeDef: {
        qDimensions: [
          {
            qLibraryId: 'jgxpDbw',
          },
          {
            qDef: {
              qGrouping: 'N',
              qFieldDefs: [
                'SegmentGroup'
              ],
            },
          }
        ],
        qMeasures: [
          {
            qLibraryId: 'VjxMHP',
          }
        ],
        qInitialDataFetch: [
          {
            qLeft: 0,
            qTop: 0,
            qWidth: 50,
            qHeight: 50
          }
        ],
        qMode: 'P',
        qNoOfLeftDims: 1,
      }
    },
  });

  // create another session object
  nuked.render({
    element: document.querySelectorAll('.object')[1],
    type: 'pivot-table',
    fields: ['Region', 'SegmentGroup', '=Budget'],
  });
})();

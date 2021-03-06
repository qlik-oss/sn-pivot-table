(function run() {
  function connect() {
    const schemaPromise = fetch('https://unpkg.com/enigma.js/schemas/3.2.json').then((response) => response.json());

    function openDoc(appId) {
      return schemaPromise.then((schema) =>
        window.enigma
          .create({
            schema,
            url: `ws://${window.location.hostname || 'localhost'}:9076/app/${encodeURIComponent(appId)}`,
          })
          .open()
          .then((qix) => qix.openDoc(appId))
      );
    }

    return openDoc;
  }

  connect()('/apps/Executive_Dashboard.qvf').then((app) => {
    // configure stardust
    const nuked = window.stardust.embed(app, {
      theme: 'dark',
      context: {
        constraints: {
          active: false, // allow interactions
        },
      },
      types: [
        {
          name: 'pivot-table',
          load: () => Promise.resolve(window['sn-pivot-table']),
        },
      ],
    });

    nuked.selections().then((selections) => selections.mount(document.querySelector('.toolbar')));

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
  });
})();

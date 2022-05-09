import enigma from 'enigma.js';

export default function connect() {
  const loadSchema = () =>
    fetch('https://unpkg.com/enigma.js/schemas/12.34.11.json').then((response) => response.json());

  const createConnection = () =>
    loadSchema().then((schema) =>
      enigma
        .create({
          schema,
          url: `ws://localhost:9076/app/${Date.now()}`,
        })
        .open()
        .then((qix) => qix.openDoc('/apps/Executive_Dashboard.qvf'))
    );

  return createConnection();
}

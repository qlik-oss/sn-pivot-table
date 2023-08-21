const { useState, useMemo, useEffect } = require("react");

const usePromise = (callback) => {
  const [result, setResult] = useState();
  const [error, setError] = useState();

  callback()
    .then((response) => setResult(response))
    .catch((e) => setError(e));

  return [result, error];
};

const mockedStardust = {
  __esModule: true,
  ...jest.requireActual("@nebula.js/stardust"),
  useState,
  useMemo,
  useEffect,
  usePromise,
};

module.exports = mockedStardust;

const { useState, useMemo, useEffect } = require("react");

const usePromise = (callback, deps) => {
  const [state, setState] = useState(() => ({
    resolved: undefined,
    rejected: undefined,
    state: "pending",
  }));

  useEffect(() => {
    callback()
      .then((response) => {
        setState({
          resolved: response,
          rejected: undefined,
          state: "resolved",
        });
      })
      .catch((e) => {
        setState({
          resolved: undefined,
          rejected: e,
          state: "resolved",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  return [state.resolved, state.rejected];
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

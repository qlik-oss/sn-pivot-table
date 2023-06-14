const { useState, useMemo, useEffect } = require("react");

const usePromise = (callback) => {
  callback();
  return [Promise.resolve(), undefined];
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

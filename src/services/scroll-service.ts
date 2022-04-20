import { ScrollService } from '../types/types';

let instance: ScrollService;

const createScrollService = (): ScrollService => {
  if (instance) return instance;

  instance = {
    shouldResetScroll: false,
    scrollLeftPosition: 0,
    scrollTopPosition: 0,
    scrollWidth: 0,
    scrollHeight: 0
  };

  return instance;
};

export default createScrollService;

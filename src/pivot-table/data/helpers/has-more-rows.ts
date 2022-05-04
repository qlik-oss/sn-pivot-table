import { Point } from '../../../types/types';

export default function hasMoreRows(size: Point, qHyperCube: EngineAPI.IHyperCube): boolean {
  return size.y < qHyperCube.qSize.qcy;
}

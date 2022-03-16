import conversion from 'qlik-object-conversion';

const arrayPath = 'qHyperCubeDef.qDimensions';
const arrayName = 'dimensions';
const itemPath = 'qOtherTotalSpec.qTotalMode';
const quarantineName = 'totalMode';

const totalMode = {
  quarantine(properties: EngineAPI.IGenericHyperCubeProperties): void {
    conversion.quarantineArrayProp({ properties, arrayPath, quarantineName, arrayName, itemPath });
  },
  unquarantine(properties: EngineAPI.IGenericHyperCubeProperties): void {
    conversion.unquarantineArrayProp({ properties, arrayPath, quarantineName, arrayName, itemPath });
  }
};

export default totalMode;

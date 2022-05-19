import { stardust } from '@nebula.js/stardust';
import { StyleService } from '../types/types';

const DEFAULT_FONT_SIZE = '13px';
const DEFAULT_FONT_FAMILY = '"Source Sans Pro", "Arial", "sans-serif"';
const DEFAULT_TEXT_COLOR = '#595959';
const DEFAULT_BACKGROUND_COLOR = 'transparent';

const THEME_STYLES = [
  { basePath: 'object.pivotTable', path: 'header', attribute: 'fontSize', defaultValue: DEFAULT_FONT_SIZE },
  { basePath: 'object.pivotTable', path: 'header', attribute: 'fontFamily', defaultValue: DEFAULT_FONT_FAMILY },
  { basePath: 'object.pivotTable', path: 'header', attribute: 'color', defaultValue: DEFAULT_TEXT_COLOR },
  { basePath: 'object.pivotTable', path: 'content', attribute: 'fontSize', defaultValue: DEFAULT_FONT_SIZE },
  { basePath: 'object.pivotTable', path: 'content', attribute: 'fontFamily', defaultValue: DEFAULT_FONT_FAMILY },
  { basePath: 'object.pivotTable', path: 'content', attribute: 'color', defaultValue: DEFAULT_TEXT_COLOR },
  { basePath: 'object.pivotTable', path: '', attribute: 'backgroundColor', defaultValue: DEFAULT_BACKGROUND_COLOR },
  { basePath: '', path: 'dataColors', attribute: 'nullColor', defaultValue: DEFAULT_BACKGROUND_COLOR },
];

const createStyleService = (theme: stardust.Theme): StyleService => {
  const styleService: StyleService = {
    header: {},
    content: {},
    title: {
      fontSize: DEFAULT_FONT_SIZE,
      fontFamily: DEFAULT_FONT_FAMILY,
      color: DEFAULT_TEXT_COLOR
    },
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    nullColor: 'red',
  };

  THEME_STYLES.forEach(({ basePath, path, attribute, defaultValue }) => {
    const resolvedValue = theme.getStyle(basePath, path, attribute) ?? defaultValue;

    switch (path) {
      case 'header':
      case 'content':
        styleService[path][attribute] = resolvedValue;
        break;
      case 'dataColors':
        styleService[attribute as 'nullColor'] = resolvedValue;
        break;
      case '':
        styleService[attribute as 'backgroundColor'] = resolvedValue;
        break;
      default:
        break;
    }
  });

  return styleService;
};

export default createStyleService;


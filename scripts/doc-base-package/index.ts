import { Package } from 'dgeni';
import { copyContentAssetsProcessor } from './processors/copyContentAssets';
import { copyFolder } from './services/copyFolder';

export default new Package('doc-base-package')
  .processor(copyContentAssetsProcessor)
  .factory(copyFolder);

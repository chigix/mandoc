import { Dgeni, Package } from 'dgeni';
import basePackage from './doc-base-package';
import { CONTENTS_PATH, OUTPUT_PATH } from './paths';

const p = new Package('docs-generation', [basePackage])
  .config(copyContentAssetsProcessor => {
    console.log(copyContentAssetsProcessor);
    copyContentAssetsProcessor.assetMappings.push(
      { from: CONTENTS_PATH, to: OUTPUT_PATH }
    );
  });

// TODO: dgeni should be removed by mandoc generation instead.
new Dgeni([p]).generate().then(docs => {
  console.log(docs.length, 'docs generated');
});

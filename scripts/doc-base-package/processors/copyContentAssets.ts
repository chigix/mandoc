import { Processor } from 'dgeni/lib/Processor';

export function copyContentAssetsProcessor(
  copyFolder: (from: string, to: string) => void
): Processor & { assetMappings: { from: string, to: string }[] } {
  return {
    assetMappings: [],
    $process() {
      this.assetMappings.forEach(map => {
        copyFolder(map.from, map.to);
      });
    },
  };
}

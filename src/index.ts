import { polygon } from '@lens-protocol/client';
import { Lens } from './lib/lens';
import { logger } from './common/logger';

(async function () {
  const lens = new Lens(polygon);
  const allFollowerAddresses = await lens.getAllFollowersByHandle(
    'mcsquared.lens'
  );

  logger.info('allFollowerAddresses: ', allFollowerAddresses);
})();

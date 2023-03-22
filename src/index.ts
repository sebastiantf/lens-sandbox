import { polygon } from '@lens-protocol/client';
import { Lens } from './lib/lens';
import { logger } from './common/logger';

(async function () {
  const lens = new Lens(polygon);
  const allFollowerAddresses = await lens.getAllFollowersByHandleConcurrently(
    'mcsquared.lens'
  );

  logger.info('allFollowerAddresses: ', allFollowerAddresses);
})();

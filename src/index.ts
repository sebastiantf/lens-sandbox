import { polygon } from '@lens-protocol/client';
import { Lens } from './lib/lens';
import { logger } from './common/logger';
import { writeToCSV } from './lib/csv';

(async function () {
  const handle = 'mcsquared.lens';
  const lens = new Lens(polygon);
  const allFollowerAddresses = await lens.getAllFollowersByHandleConcurrently(
    handle
  );

  logger.info('allFollowerAddresses: ', allFollowerAddresses);

  const data = allFollowerAddresses.map((address) => ({
    address
  }));

  writeToCSV('address', data, handle + '.csv');
})();

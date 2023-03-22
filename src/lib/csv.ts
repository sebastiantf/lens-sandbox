import { createObjectCsvWriter } from 'csv-writer';
import { logger } from '../common/logger';

export const writeToCSV = (
  header: string,
  data: { address: string }[],
  outputFileName: string
) => {
  const csvHeaders = [{ id: header, title: header }];
  const csvWriter = createObjectCsvWriter({
    path: outputFileName,
    header: csvHeaders
  });
  csvWriter
    .writeRecords(data)
    .then(() => logger.info('CSV file created successfully'))
    .catch((err) => logger.error(err));
};

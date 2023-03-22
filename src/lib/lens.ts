import LensClient, {
  FollowerFragment,
  PaginatedResult
} from '@lens-protocol/client';
import { Environment } from '@lens-protocol/client/dist/declarations/src/consts/environments';
import assert from 'assert';
import { logger } from '../common/logger';

export class Lens {
  protected lensClient: LensClient;

  constructor(environment: Environment) {
    this.lensClient = new LensClient({
      environment
    });
  }

  public async getAllFollowersByHandle(handle: string) {
    // get lens profile by handle
    const profileByHandle = await this.lensClient.profile.fetch({
      handle
    });
    const profileId = profileByHandle?.id ?? '';
    logger.info('profileId: ', profileId);
    logger.info('handle: ', handle);

    // init all results
    const allResults: FollowerFragment[] = [];
    // init first page of results
    const firstPage = await this.lensClient.profile.allFollowers({ profileId });

    // total results count
    const totalFollowers = firstPage.pageInfo.totalCount ?? 0;
    logger.info('totalFollowers: ', totalFollowers);

    // loop as long as result != null
    let page = 1;
    let nextResult: PaginatedResult<FollowerFragment> | null = firstPage;
    while (nextResult) {
      allResults.push(...nextResult.items);
      logger.debug(`Fetched page ${page++}`);

      nextResult = await nextResult.next();
    }
    logger.info('allResults.length:', allResults.length);
    assert.equal(totalFollowers, allResults.length);

    // extract addresses alone
    const allFollowerAddresses = allResults.map(
      (result) => result.wallet.address
    );
    logger.info('allFollowerAddresses.length: ', allFollowerAddresses.length);
    assert.equal(allFollowerAddresses.length, allResults.length);

    return allFollowerAddresses;
  }

  public async getAllFollowersByHandleConcurrently(handle: string) {
    // get lens profile by handle
    const profileByHandle = await this.lensClient.profile.fetch({
      handle
    });
    const profileId = profileByHandle?.id ?? '';
    logger.info('profileId: ', profileId);
    logger.info('handle: ', handle);

    // init first page of results
    const firstPage = await this.lensClient.profile.allFollowers({ profileId });

    // total results count
    const totalFollowers = firstPage.pageInfo.totalCount ?? 0;
    logger.info('totalFollowers: ', totalFollowers);

    const limit = 50;
    const noOfPages = Math.ceil(totalFollowers / limit);
    logger.info('noOfPages: ', noOfPages);

    const promises: Promise<PaginatedResult<FollowerFragment>>[] = Array(
      noOfPages
    )
      .fill(0)
      .map((_, index) => {
        const count = index * limit;
        let cursor = count.toString();
        const remainingFollowers = totalFollowers - count;
        const lastPage = index === noOfPages - 1;
        if (lastPage) {
          // Calculate the cursor and limit for the last page
          cursor = (totalFollowers - remainingFollowers).toString();
        }
        const pageLimit = lastPage ? remainingFollowers : limit;
        return this.lensClient.profile.allFollowers({
          profileId,
          cursor,
          limit: pageLimit
        });
      });
    const results = await Promise.all(promises);
    const allResults = results.map((result) => result.items).flat();
    assert.equal(totalFollowers, allResults.length);

    // extract addresses alone
    const allFollowerAddresses = allResults.map(
      (result) => result.wallet.address
    );
    logger.info('allFollowerAddresses.length: ', allFollowerAddresses.length);
    assert.equal(allFollowerAddresses.length, allResults.length);

    return allFollowerAddresses;
  }
}

import LensClient from '@lens-protocol/client';
import { Environment } from '@lens-protocol/client/dist/declarations/src/consts/environments';

export class Lens {
  protected lensClient: LensClient;

  constructor(environment: Environment) {
    this.lensClient = new LensClient({
      environment
    });
  }
}

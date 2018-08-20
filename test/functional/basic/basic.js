// @flow

import { CREDENTIALS } from '../config.functional';
import { HTTP_STATUS } from '../../lib/constants';
import whoAmI from './whoami';
import ping from './ping';


export default function(server: any, gitlab: any) {
  describe('basic test endpoints', () => {

    beforeAll(function() {
      return gitlab.auth(CREDENTIALS.user, CREDENTIALS.password)
        .status(HTTP_STATUS.CREATED)
        .body_ok(/'test'/);
    });

    whoAmI(server);
    ping(server);
  });
}

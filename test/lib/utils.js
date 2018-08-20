// @flow

import _ from 'lodash';


export function buildToken(type: string, token: string) {
  return `${_.capitalize(type)} ${token}`;
}

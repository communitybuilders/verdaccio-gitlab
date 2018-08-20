// @flow

import _ from 'lodash';
import assert from 'assert';
import smartRequest from './request';
import type {IServerBridge} from '../types';
import { HEADERS, HTTP_STATUS, TOKEN_BASIC } from './constants';
import { buildToken } from './utils';
import { CREDENTIALS } from '../functional/config.functional';

const buildAuthHeader = (user, pass): string => {
  return buildToken(TOKEN_BASIC, new Buffer(`${user}:${pass}`).toString('base64'));
};

export default class Server implements IServerBridge {
  url: string;
  userAgent: string;
  authstr: string;

  constructor(url: string) {
    this.url = url.replace(/\/$/, '');
    this.userAgent = 'node/v8.1.2 linux x64';
    this.authstr = buildAuthHeader(CREDENTIALS.user, CREDENTIALS.password);
  }

  request(options: any): any {
    assert(options.uri);
    const headers = options.headers || {};

    headers.accept = headers.accept || HEADERS.JSON;
    headers['user-agent'] = headers['user-agent'] || this.userAgent;
    headers.authorization = headers.authorization || this.authstr;

    return smartRequest({
      url: this.url + options.uri,
      method: options.method || 'GET',
      headers: headers,
      encoding: options.encoding,
      json: _.isNil(options.json) === false ? options.json : true,
    });
  }

  auth(name: string, password: string) {
    this.authstr = buildAuthHeader(name, password);
    return this.request({
      uri: `/-/user/org.couchdb.user:${encodeURIComponent(name)}/-rev/undefined`,
      method: 'PUT',
      json: {
        name: name,
        password: password,
        email: `${CREDENTIALS.user}@example.com`,
        _id: `org.couchdb.user:${name}`,
        type: 'user',
        roles: [],
        date: new Date(),
      },
    });
  }

  logout(token: string) {
    return this.request({
      uri: `/-/user/token/${encodeURIComponent(token)}`,
      method: 'DELETE',
    });
  }

  whoami() {
    return this.request({
      uri: '/-/whoami'
    }).status(HTTP_STATUS.OK)
      .then(function(body) {
        return body.username;
      });
  }

  ping() {
    return this.request({
      uri: '/-/ping'
    }).status(HTTP_STATUS.OK)
      .then(function(body) {
        return body;
      });
  }

  debug() {
    return this.request({
      uri: '/-/_debug',
      method: 'GET',
      headers: {
        'content-type': HEADERS.JSON,
      },
    })
  }
}

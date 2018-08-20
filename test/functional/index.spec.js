// @flow

import type { IServerBridge } from '../types';

import basic from './basic/basic';


describe('Functional Tests verdaccio-gitlab', function() {
  jest.setTimeout(10000);
  const server1: IServerBridge = global.__SERVERS__[0];
  const gitlab = global.__GITLAB_SERVER__.app;

  // list of tests
  // note: order of the following calls is important
  basic(server1, gitlab);

});

process.on('unhandledRejection', function(err) {
  console.error("unhandledRejection", err);
  process.nextTick(function() {
    throw err;
  });
});

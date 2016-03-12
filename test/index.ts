// FIXME: workaround for vdom-parser
var global = Function('return this')();
global.DOMParser = () => null;

import test from 'ava';
import { O } from 'b-o-a';
import { init as initType } from '../src/';
import { DOM as DOMType } from '../src/dom';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

test.beforeEach(t => {
  const sandbox = sinon.sandbox.create();
  const render = sandbox.stub();
  const DOM = sandbox.stub();
  t.context.render = render;
  t.context.DOM = DOM;
  t.context.init = proxyquire('../src/', {
    './dom': { DOM }
  }).init;
});

test(t => {
  const init: typeof initType = t.context.init;
  const DOM: typeof DOMType = t.context.DOM;
  const render: (s: any, o: any) => any = t.context.render;
  const root = 'div#app';
  const action$ = O.empty();
  const options = { re: () => null };
  init({ render, root }).handler(action$, options);
  t.ok((<sinon.SinonStub>t.context.DOM).callCount === 1);
  t.same((<sinon.SinonStub>t.context.DOM).getCall(0).args, <any[]>[root]);
});

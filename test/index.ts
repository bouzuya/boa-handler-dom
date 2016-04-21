import test from 'ava';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import { A, O } from 'boa-core';
import { init as initType } from '../src/';
import { DOM as DOMType } from '../src/dom';

test.beforeEach(t => {
  const sandbox = sinon.sandbox.create();
  const render = sandbox.stub();
  const DOM = sandbox.stub();
  DOM.prototype = { renderToDOM: sandbox.stub() };
  t.context.render = render;
  t.context.DOM = DOM;
  t.context.renderToDOM = DOM.prototype.renderToDOM;
  t.context.init = proxyquire('../src/', {
    './dom': { DOM }
  }).init;
});

test(t => {
  const init: typeof initType = t.context.init;
  const DOM: sinon.SinonStub = t.context.DOM;
  const renderToDOM: sinon.SinonStub = t.context.renderToDOM;
  const render: sinon.SinonStub = t.context.render;
  const root = 'div#app';
  const state = { foo: 'bar' };
  const vtree = { bar: 'baz' };
  const action$ = O.of<A<any>>({
    type: 'render', data: state
  });
  const options = { re: () => null };
  render.returns(vtree);
  renderToDOM.returns(null);
  init({ render, root }).handler(action$, options).subscribe(() => {
    t.fail();
  });
  // const dom = new DOM(root);
  t.truthy(DOM.callCount === 1);
  t.deepEqual(DOM.getCall(0).args, <any[]>[root]);
  // const vtree = render(state, { create, e: re });
  t.truthy(render.callCount === 1);
  t.deepEqual(render.getCall(0).args[0], state);
  t.truthy(render.getCall(0).args[1].create);
  t.truthy(render.getCall(0).args[1].e);
  // dom.renderToDOM(vtree);
  t.truthy(renderToDOM.callCount === 1);
  t.deepEqual(renderToDOM.getCall(0).args[0], vtree);
});

test(t => {
  const init: typeof initType = t.context.init;
  const DOM: sinon.SinonStub = t.context.DOM;
  const renderToDOM: sinon.SinonStub = t.context.renderToDOM;
  const render: sinon.SinonStub = t.context.render;
  const root = 'div#app';
  const state = { foo: 'bar' };
  const vtree = { bar: 'baz' };
  const action$ = O.of<A<any>>({
    type: 'notRender', data: state
  });
  const options = { re: () => null };
  render.returns(vtree);
  renderToDOM.returns(null);
  init({ render, root }).handler(action$, options).subscribe(() => {
    t.fail();
  });
  // const dom = new DOM(root);
  t.truthy(DOM.callCount === 1);
  t.deepEqual(DOM.getCall(0).args, <any[]>[root]);
  // const vtree = render(state, { create, e: re });
  t.truthy(render.callCount === 0);
  // dom.renderToDOM(vtree);
  t.truthy(renderToDOM.callCount === 0);
});

// RenderAction -> render -> render to DOM

import { A, O, Handler } from 'boa-core';
import { DOM } from './dom';
import { create, VDOM } from 'boa-vdom';

type DOMOptions = {
  root: string;
  render: (state: any, options: any) => VDOM;
  renderActionType?: string;
};

export interface DOMResponse {
  handler: Handler;
}

const init = (domOptions: DOMOptions): DOMResponse => {
  const handler = (action$, options) => {
    const { root, render, renderActionType } = domOptions;
    const type = renderActionType ? renderActionType : 'render';
    const dom = new DOM(root);
    const { re } = options;
    return action$
      .map(action => {
        if (action.type !== type) return action;
        const state: any = action.data;
        const vtree = render(state, { create, e: re });
        dom.renderToDOM(vtree);
        return; // return undefined
      })
      .filter(a => !!a) // remove undefined
      .share();
  };
  return { handler };
};

export { init };

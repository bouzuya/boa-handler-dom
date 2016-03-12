// RenderAction -> render -> render to DOM

import { A, O, Handler } from 'b-o-a';
import { DOM } from './dom';

type DOMOptions = {
  root: string;
  render: (state: any, options: any) => any;
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
        const vtree = render(state, { e: re });
        dom.renderToDOM(vtree);
        return; // return undefined
      })
      .filter(a => !!a) // remove undefined
      .share();
  };
  return { handler };
};

export { init };

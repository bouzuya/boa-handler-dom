// RenderAction -> render -> render to DOM

import { A, O, Handler } from 'boa-core';
import { _do } from 'rxjs/operator/do';
import { filter } from 'rxjs/operator/filter';
import { share } from 'rxjs/operator/share';
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
  const handler: Handler = (action$, options) => {
    const { root, render, renderActionType } = domOptions;
    const type = renderActionType ? renderActionType : 'render';
    const dom = new DOM(root);
    const { re } = options;
    return share.call(
      filter.call(
        _do.call(
          filter.call(
            action$,
            (action: A<any>): boolean => action.type === type
          ),
          (action: A<any>): void => {
            const state = action.data;
            const vtree = render(state, { create, e: re });
            dom.renderToDOM(vtree);
          }
        ),
        () => false // remove all
      )
    );
  };
  return { handler };
};

export { init };

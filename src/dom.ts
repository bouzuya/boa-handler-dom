import { DOM as DOM2, VDOM } from 'boa-vdom';

const { init } = DOM2;

class DOM {
  private render: DOM2.Render;

  constructor(rootSelector: string) {
    const root = document.querySelector(rootSelector);
    this.render = init({ root });
  }

  renderToDOM(vtree: VDOM): void {
    this.render = this.render(vtree).render;
  }
}

export { DOM };

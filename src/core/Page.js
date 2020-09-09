export class Page {
  constructor(params) {
    this.params = params;
  }

  getRoot() {
    throw new Error(
      `getRoot method must be implemented in class ${this.constructor.name}`
    );
  }

  afterRender() {}

  destroy() {}
}

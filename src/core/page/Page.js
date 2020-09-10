export class Page {
  constructor(params) {
    this.params = params || Date.now();
  }

  getRoot() {
    throw new Error(
      `getRoot method must be implemented in class ${this.constructor.name}`
    );
  }

  afterRender() {}

  destroy() {}
}

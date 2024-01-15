export declare const decorFunc: (partical: Function) => (
  _target: any,
  _key: any,
  descriptor: {
    value: any;
    initializer: {
      apply: (arg0: any) => any;
    };
  },
) => any;
/**
 * @param {any} function
 * @returns {any}
 * @description: before fn
 */
export declare const before: any;
/**
 * @param {any} function
 * @returns {any}
 * @description: after fn
 */
export declare const after: any;
export declare const once: any;
declare const _default: {
  before: any;
  after: any;
  decorFunc: (partical: Function) => (
    _target: any,
    _key: any,
    descriptor: {
      value: any;
      initializer: {
        apply: (arg0: any) => any;
      };
    },
  ) => any;
  once: any;
};
export default _default;

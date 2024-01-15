export { ExposureTag } from './trackExposure';
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
export declare const once: any;
/** 上报方法参数 */
type ReportParams = {
  data: Record<string, any>;
  name: string;
};
type ReportAopFunc = (...rest: any) => ReportParams;
/**
 * @param {string} name
 * @param {object} data
 * @returns {any}
 * @description:方法执行前触发埋点
 */
export declare const beforeTr: (param: ReportParams | ReportAopFunc, ...args: any[]) => any;
/**
 * @param {string} name
 * @param {object} data
 * @returns {any}
 * @description:方法后触发埋点，支持接受方法返回参数
 */
export declare const afterTr: (param: ReportParams | ReportAopFunc, ...args: any[]) => any;
/**
 * @param {string} name
 * @param {object} data
 * @returns {any}
 * @description:单次方法后执行埋点
 */
export declare const onceTr: (param: ReportParams | ReportAopFunc, ...args: any[]) => any;
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
  beforeTr: (param: ReportParams | ReportAopFunc, ...args: any[]) => any;
  afterTr: (param: ReportParams | ReportAopFunc, ...args: any[]) => any;
  onceTr: (param: ReportParams | ReportAopFunc, ...args: any[]) => any;
};
export default _default;

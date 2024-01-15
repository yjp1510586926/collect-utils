import 'intersection-observer';
declare class Exposure {
  funcData: object;
  _observer: IntersectionObserver | null;
  constructor();
  init(): void;
  /**
   * @param {any} entry { el:string, id:string, eventFunc:function }
   * @returns {any}
   * @description:添加至观察列表
   */
  add(entry: { el: HTMLElement; id: string; eventFunc: Function }): void;
  /**
   * @param {any} id
   * @param {any} eventParam
   * @returns {any}
   * @description: 触发上报数据
   */
  send(id: string, eventParam: object): void;
  /**
   * @param {HTMLElement} dom
   * @returns {any}
   * @description: 卸载dom曝光观测
   */
  unloadDomFunc(dom: HTMLElement): void;
}
declare const _default: Exposure;
export default _default;

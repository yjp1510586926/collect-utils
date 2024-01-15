/*
 * @Description:
 * @Autor: yjpyang
 * @Date: 2023-01-09 17:43:55
 * @LastEditors: yjp
 * @LastEditTime: 2024-01-15 11:50:14
 * @FilePath: /collect-utils/packages/track-utils-aop/src/exposure.ts
 */
// polyfill 解决兼容性问题
import 'intersection-observer';
// @ts-ignore
import { isFunction } from 'lodash';
// 延迟时间，节流作用
/*  @ts-ignore */
IntersectionObserver.prototype['THROTTLE_TIMEOUT'] = 300;

class Exposure {
  funcData: object;
  _observer: IntersectionObserver | null;

  constructor() {
    this.funcData = {};
    this._observer = null;
    this.init();
  }

  // 初始化
  init() {
    const self = this;
    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 进入视图触发
            try {
              const id =
                /*  @ts-ignore */
                entry.target.attributes['id']?.value;
              const eventParam_str =
                /*  @ts-ignore */
                entry.target.attributes['dataparam']?.value;
              const eventParam = eventParam_str ? JSON.parse(eventParam_str) : {};
              // 已经上报的节点、取消对该DOM的观察
              self._observer?.unobserve(entry.target);
              self.send(id, eventParam);
            } catch (err) {
              console.log(err);
            }
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 1, // 目标dom出现在视图的比例 0 - 1
      },
    );
  }

  /**
   * @param {any} entry { el:string, id:string, eventFunc:function }
   * @returns {any}
   * @description:添加至观察列表
   */
  add(entry: { el: HTMLElement; id: string; eventFunc: Function }) {
    const { el, id, eventFunc } = entry || {};
    if (el && id != '' && isFunction(eventFunc)) {
      this._observer && this._observer.observe(el);
      /*  @ts-ignore */
      this.funcData[id] = { eventFunc };
    } else {
      console.error('id:', id, '埋点数据缺失或错误');
    }
  }

  /**
   * @param {any} id
   * @param {any} eventParam
   * @returns {any}
   * @description: 触发上报数据
   */
  send(id: string, eventParam: object) {
    /*  @ts-ignore */
    id && this.funcData[id]?.eventFunc(eventParam);
  }
  /**
   * @param {HTMLElement} dom
   * @returns {any}
   * @description: 卸载dom曝光观测
   */
  unloadDomFunc(dom: HTMLElement) {
    try {
      console.log('曝光组件已卸载');
      dom && this._observer?.unobserve(dom);
    } catch (err) {
      console.log(dom, '曝光组件卸载失败');
    }
  }
}

export default new Exposure();

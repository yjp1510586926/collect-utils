/*
 * @Description:
 * @Autor: yjpyang
 * @Date: 2024-01-12 19:11:07
 * @LastEditors: yjp
 * @LastEditTime: 2024-01-15 12:06:05
 * @FilePath: /collect-utils/packages/rack-utils-aop/src/utils.ts
 */

// @ts-ignore
import curryN from 'lodash/fp/curryN';
// @ts-ignore
import isFunction from 'lodash/fp/isFunction';
// @ts-ignore
import _once from 'lodash/fp/once';
// @ts-ignore
import propSet from 'lodash/fp/set';

function isThenable(f: Promise<any>) {
  return f && isFunction(f.then);
}

/* @description: decorator 装饰器
 * @param {*} partical
 * @param {*} key
 * @param {*} descriptor
 * @return {*}
 */
export const decorFunc = (partical: Function) => {
  return (
    _target: any,
    _key: any,
    descriptor: { value: any; initializer: { apply: (arg0: any) => any } },
  ) => {
    const value = function (this: any, ...args: any[]) {
      return partical.call(this, descriptor.value, this).apply(this, args);
    };
    if (descriptor.initializer) {
      return propSet(
        'initializer',
        function (this: any) {
          const value = descriptor.initializer.apply(this);
          return function (this: any, ...args: any) {
            return partical.call(this, value, this).apply(this, args);
          };
        },
        descriptor,
      );
    }
    return propSet('value', value, descriptor);
  };
};

/**
 * @param {any} function
 * @returns {any}
 * @description: before fn
 */
export const before = curryN(
  2,
  (aopFn: Function, fn: Function) =>
    function (this: any, ...args: any[]) {
      try {
        isFunction(aopFn) && aopFn.apply(this, args);
      } catch (e) {
        console.error(e);
      }
      return fn.apply(this, args);
    },
);

/**
 * @param {any} function
 * @returns {any}
 * @description: after fn
 */
export const after = curryN(
  2,
  (aopFn: Function, fn: { apply: (arg0: any, arg1: any[]) => any }) => {
    return function (this: any, ...args: any[]) {
      const self = this;
      const r = fn.apply(this, args);
      // 埋点方法
      const evalF = (data: any) => {
        try {
          aopFn.apply(self, [args, data]);
        } catch (e) {
          console.error(e);
        }
      };
      // 埋点异步方法处理
      if (isThenable(r)) {
        return r.then((rr: any) => {
          evalF(rr);
          return rr;
        });
      }
      evalF(r);
      return r;
    };
  },
);

export const once = _once;

export default {
  before,
  after,
  decorFunc,
  once,
};

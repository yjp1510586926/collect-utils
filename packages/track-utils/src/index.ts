/*
 * @Description:
 * @Autor: yjpyang
 * @Date: 2023-01-11 18:06:35
 * @LastEditors: yjp
 * @LastEditTime: 2024-01-15 12:04:39
 * @FilePath: /collect-utils/packages/track-utils-aop/src/index.ts
 */
// @ts-ignore
import isFunction from 'lodash/fp/isFunction';
// @ts-ignore
// @ts-ignore
import section from './utils';
export { ExposureTag } from './trackExposure';

export const decorFunc = section.decorFunc;
export const once = section.once;

/** 上报方法参数 */
type ReportParams = {
  data: Record<string, any>;
  name: string;
};

type ReportAopFunc = (...rest: any) => ReportParams;

/** 执行传入的函数 */
const evalFunc = function (param: ReportParams | ReportAopFunc, ...arg: any[]) {
  let { name, data } = { name: '', data: {} };
  if (isFunction(param)) {
    try {
      let obj = (param as ReportAopFunc).call(this, ...arg) || {};
      name = obj.name;
      data = obj.data;
    } catch (err) {
      console.error('【埋点方法执行异常】', err);
    }
  } else {
    name = param.name;
    data = (param as ReportParams).data;
  }
  return { name, data };
};

/**
 * @param {string} name
 * @param {object} data
 * @returns {any}
 * @description:方法执行前触发埋点
 */
export const beforeTr = function (param: ReportParams | ReportAopFunc, ...args: any[]) {
  return section
    .before(function (...arg: any) {
      try {
        let { name, data } = evalFunc.call(this, param, ...arg);
        platTrack(name, data);
      } catch (e) {
        console.error('埋点after执行异常', e);
      }
    }, ...args)
    .call(this);
};

/**
 * @param {string} name
 * @param {object} data
 * @returns {any}
 * @description:方法后触发埋点，支持接受方法返回参数
 */
export const afterTr = function (param: ReportParams | ReportAopFunc, ...args: any[]) {
  return section.after(function (...arg: any) {
    try {
      let { name, data } = evalFunc.call(this, param, ...arg);
      platTrack(name, data);
    } catch (e) {
      console.error('埋点after执行异常', e);
    }
  }, ...args);
};

/**
 * @param {string} name
 * @param {object} data
 * @returns {any}
 * @description:单次方法后执行埋点
 */
export const onceTr = function (param: ReportParams | ReportAopFunc, ...args: any[]) {
  return section.after(
    section.once(function (...arg: any) {
      try {
        let { name, data } = evalFunc.call(this, param, ...arg);
        platTrack(name, data);
      } catch (e) {
        console.error('埋点after执行异常', e);
      }
    }),
    ...args,
  );
};

const platTrack = (name?: string, data?: any) => {
  console.log('触发埋点接口，参数：', name, data);
};

export default {
  beforeTr,
  afterTr,
  onceTr,
  ...section,
};

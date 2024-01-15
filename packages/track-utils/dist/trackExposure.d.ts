import React from 'react';
interface IProps {
  param?: object;
  sendData?: boolean;
  children: React.ReactElement;
}
/**
 * @param {any} WrappedComponent
 * @returns {any}
 * @description: 使用hoc，目的在于属性封装 //
 */
/** @description:埋点标签 多子元素只给第一个子元素埋曝光事件 */
export declare const ExposureTag: React.FC<IProps>;
declare const _default: {
  ExposureTag: React.FC<IProps>;
};
export default _default;

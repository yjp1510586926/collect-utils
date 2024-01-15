/*
 * @Description:
 * @Autor: yjpyang
 * @Date: 2023-01-09 17:44:56
 * @LastEditors: yjp
 * @LastEditTime: 2024-01-15 11:44:42
 * @FilePath: /collect-utils/packages/track-utils-aop/src/trackExposure.tsx
 */
import React, { useEffect, useMemo } from 'react';
import exposure from './exposure';
// @ts-ignore
// import { lgSa } from 'lagou-mds-lgsa';
import { isString, isNumber, isBoolean } from 'lodash';

interface IProps {
  // id: string;
  // eventFunc: Function;
  param?: object;
  sendData?: boolean;
  children: React.ReactElement;
}

//产生随机数函数
const RndNum = (n = 10) => {
  var rnd = '';
  for (var i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
  return rnd;
};

/**
 * @param {any} WrappedComponent
 * @returns {any}
 * @description: 使用hoc，目的在于属性封装 //
 */
// export const ExposureHoc =
//     (WrappedComponent: JSX.IntrinsicAttributes) =>
//         (props: IProps) => {
//             const { eventFunc, eventParam = {}, sendData = true } = props;
//             const id = RndNum()

//             useEffect(() => {
//                 const el = document.getElementById(id)
//                 sendData && el &&
//                     exposure.add({
//                         el,
//                         id,
//                         eventFunc,
//                     });
//             }, []);

//             return (
//                 <div
//                     id={id}
//                     dataparam={JSON.stringify(eventParam)}
//                 >
//                     {  /*  @ts-ignore */}
//                     <WrappedComponent {...props} />
//                 </div>
//             );
//         };

/** @description:埋点标签 多子元素只给第一个子元素埋曝光事件 */
export const ExposureTag: React.FC<IProps> = (props) => {
  const { param, sendData = true } = props;
  const id = useMemo(RndNum, []);

  useEffect(() => {
    const el = id && document.getElementById(id);
    if (el) {
      // const name = (param as { name: string })?.name;
      // const data = (param as { data: object })?.data;
      const eventFunc = () => {
        console.log('上报埋点测试ExposureTag');
      };
      sendData &&
        el &&
        exposure.add({
          el,
          id,
          eventFunc,
        });
    }
    return () => {
      el && exposure.unloadDomFunc(el);
    };
  }, [id]);
  let children = null;
  const propsChildren = props?.children || null;
  if (
    propsChildren &&
    !isString(propsChildren) &&
    !isNumber(propsChildren) &&
    !isBoolean(propsChildren)
  ) {
    children = React.Children.map(propsChildren, (child, index: number) => {
      // 多子元素只给第一个子元素埋曝光事件
      if (index === 0) {
        return React.cloneElement(
          child as React.ReactElement<any, string | React.JSXElementConstructor<any>>,
          {
            id,
            dataparam: JSON.stringify(param),
          },
        );
      } else {
        return child;
      }
    });
  } else {
    console.log('曝光组件接收的子组件不符合DOM标准');
  }

  return <>{children}</>;
};

export default { ExposureTag };

import isFunction from 'lodash/fp/isFunction';
import curryN from 'lodash/fp/curryN';
import _once from 'lodash/fp/once';
import propSet from 'lodash/fp/set';
import React, { useMemo, useEffect } from 'react';
import 'intersection-observer';
import { isFunction as isFunction$1, isString, isNumber, isBoolean } from 'lodash';

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r &&
      (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })),
      t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2
      ? ownKeys(Object(t), !0).forEach(function (r) {
          _defineProperty(e, r, t[r]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
      : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ('object' != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || 'default');
    if ('object' != typeof i) return i;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return ('string' === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, 'string');
  return 'symbol' == typeof i ? i : String(i);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, 'prototype', {
    writable: false,
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/*
 * @Description:
 * @Autor: yjpyang
 * @Date: 2024-01-12 19:11:07
 * @LastEditors: yjp
 * @LastEditTime: 2024-01-15 12:06:05
 * @FilePath: /collect-utils/packages/rack-utils-aop/src/utils.ts
 */
function isThenable(f) {
  return f && isFunction(f.then);
}
/* @description: decorator 装饰器
 * @param {*} partical
 * @param {*} key
 * @param {*} descriptor
 * @return {*}
 */
var decorFunc = function decorFunc(partical) {
  return function (_target, _key, descriptor) {
    var value = function value() {
      for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return partical.call(this, descriptor.value, this).apply(this, args);
    };
    if (descriptor.initializer) {
      return propSet(
        'initializer',
        function () {
          var value = descriptor.initializer.apply(this);
          return function () {
            for (
              var _len2 = arguments.length, args = new Array(_len2), _key3 = 0;
              _key3 < _len2;
              _key3++
            ) {
              args[_key3] = arguments[_key3];
            }
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
var before = curryN(2, function (aopFn, fn) {
  return function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
      args[_key4] = arguments[_key4];
    }
    try {
      isFunction(aopFn) && aopFn.apply(this, args);
    } catch (e) {
      console.error(e);
    }
    return fn.apply(this, args);
  };
});
/**
 * @param {any} function
 * @returns {any}
 * @description: after fn
 */
var after = curryN(2, function (aopFn, fn) {
  return function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key5 = 0; _key5 < _len4; _key5++) {
      args[_key5] = arguments[_key5];
    }
    var self = this;
    var r = fn.apply(this, args);
    // 埋点方法
    var evalF = function evalF(data) {
      try {
        aopFn.apply(self, [args, data]);
      } catch (e) {
        console.error(e);
      }
    };
    // 埋点异步方法处理
    if (isThenable(r)) {
      return r.then(function (rr) {
        evalF(rr);
        return rr;
      });
    }
    evalF(r);
    return r;
  };
});
var once = _once;
var section = {
  before: before,
  after: after,
  decorFunc: decorFunc,
  once: once,
};

// 延迟时间，节流作用
/*  @ts-ignore */
IntersectionObserver.prototype['THROTTLE_TIMEOUT'] = 300;
var Exposure = /*#__PURE__*/ (function () {
  function Exposure() {
    _classCallCheck(this, Exposure);
    this.funcData = void 0;
    this._observer = void 0;
    this.funcData = {};
    this._observer = null;
    this.init();
  }
  // 初始化
  _createClass(Exposure, [
    {
      key: 'init',
      value: function init() {
        var self = this;
        this._observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                // 进入视图触发
                try {
                  var _entry$target$attribu, _entry$target$attribu2, _self$_observer;
                  var id =
                    /*  @ts-ignore */ (_entry$target$attribu = entry.target.attributes['id']) ===
                      null || _entry$target$attribu === void 0
                      ? void 0
                      : _entry$target$attribu.value;
                  var eventParam_str =
                    /*  @ts-ignore */ (_entry$target$attribu2 =
                      entry.target.attributes['dataparam']) === null ||
                    _entry$target$attribu2 === void 0
                      ? void 0
                      : _entry$target$attribu2.value;
                  var eventParam = eventParam_str ? JSON.parse(eventParam_str) : {};
                  // 已经上报的节点、取消对该DOM的观察
                  (_self$_observer = self._observer) === null || _self$_observer === void 0
                    ? void 0
                    : _self$_observer.unobserve(entry.target);
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
      },
      /**
       * @param {any} entry { el:string, id:string, eventFunc:function }
       * @returns {any}
       * @description:添加至观察列表
       */
    },
    {
      key: 'add',
      value: function add(entry) {
        var _ref = entry || {},
          el = _ref.el,
          id = _ref.id,
          eventFunc = _ref.eventFunc;
        if (el && id != '' && isFunction$1(eventFunc)) {
          this._observer && this._observer.observe(el);
          /*  @ts-ignore */
          this.funcData[id] = {
            eventFunc: eventFunc,
          };
        } else {
          console.error('id:', id, '埋点数据缺失或错误');
        }
      },
      /**
       * @param {any} id
       * @param {any} eventParam
       * @returns {any}
       * @description: 触发上报数据
       */
    },
    {
      key: 'send',
      value: function send(id, eventParam) {
        var _this$funcData$id;
        /*  @ts-ignore */
        id &&
          ((_this$funcData$id = this.funcData[id]) === null || _this$funcData$id === void 0
            ? void 0
            : _this$funcData$id.eventFunc(eventParam));
      },
      /**
       * @param {HTMLElement} dom
       * @returns {any}
       * @description: 卸载dom曝光观测
       */
    },
    {
      key: 'unloadDomFunc',
      value: function unloadDomFunc(dom) {
        try {
          var _this$_observer;
          console.log('曝光组件已卸载');
          dom &&
            ((_this$_observer = this._observer) === null || _this$_observer === void 0
              ? void 0
              : _this$_observer.unobserve(dom));
        } catch (err) {
          console.log(dom, '曝光组件卸载失败');
        }
      },
    },
  ]);
  return Exposure;
})();
var exposure = new Exposure();

/*
 * @Description:
 * @Autor: yjpyang
 * @Date: 2023-01-09 17:44:56
 * @LastEditors: yjp
 * @LastEditTime: 2024-01-15 11:44:42
 * @FilePath: /collect-utils/packages/rack-utils-aop/src/trackExposure.tsx
 */
//产生随机数函数
var RndNum = function RndNum() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
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
var ExposureTag = function ExposureTag(props) {
  var param = props.param,
    _props$sendData = props.sendData,
    sendData = _props$sendData === void 0 ? true : _props$sendData;
  var id = useMemo(RndNum, []);
  useEffect(
    function () {
      var el = id && document.getElementById(id);
      if (el) {
        // const name = (param as { name: string })?.name;
        // const data = (param as { data: object })?.data;
        var eventFunc = function eventFunc() {
          console.log('上报埋点测试ExposureTag');
        };
        sendData &&
          el &&
          exposure.add({
            el: el,
            id: id,
            eventFunc: eventFunc,
          });
      }
      return function () {
        el && exposure.unloadDomFunc(el);
      };
    },
    [id],
  );
  var children = null;
  var propsChildren = (props === null || props === void 0 ? void 0 : props.children) || null;
  if (
    propsChildren &&
    !isString(propsChildren) &&
    !isNumber(propsChildren) &&
    !isBoolean(propsChildren)
  ) {
    children = React.Children.map(propsChildren, function (child, index) {
      // 多子元素只给第一个子元素埋曝光事件
      if (index === 0) {
        return /*#__PURE__*/ React.cloneElement(child, {
          id: id,
          dataparam: JSON.stringify(param),
        });
      } else {
        return child;
      }
    });
  } else {
    console.log('曝光组件接收的子组件不符合DOM标准');
  }
  return /*#__PURE__*/ React.createElement(React.Fragment, null, children);
};

var decorFunc$1 = section.decorFunc;
var once$1 = section.once;
/** 执行传入的函数 */
var evalFunc = function evalFunc(param) {
  var _name$data = {
      name: '',
      data: {},
    },
    name = _name$data.name,
    data = _name$data.data;
  if (isFunction(param)) {
    try {
      for (
        var _len = arguments.length, arg = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
        _key < _len;
        _key++
      ) {
        arg[_key - 1] = arguments[_key];
      }
      var obj = param.call.apply(param, [this].concat(arg)) || {};
      name = obj.name;
      data = obj.data;
    } catch (err) {
      console.error('【埋点方法执行异常】', err);
    }
  } else {
    name = param.name;
    data = param.data;
  }
  return {
    name: name,
    data: data,
  };
};
/**
 * @param {string} name
 * @param {object} data
 * @returns {any}
 * @description:方法执行前触发埋点
 */
var beforeTr = function beforeTr(param) {
  for (
    var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1;
    _key2 < _len2;
    _key2++
  ) {
    args[_key2 - 1] = arguments[_key2];
  }
  return section.before
    .apply(
      section,
      [
        function () {
          try {
            for (
              var _len3 = arguments.length, arg = new Array(_len3), _key3 = 0;
              _key3 < _len3;
              _key3++
            ) {
              arg[_key3] = arguments[_key3];
            }
            var _evalFunc$call = evalFunc.call.apply(evalFunc, [this, param].concat(arg)),
              name = _evalFunc$call.name,
              data = _evalFunc$call.data;
            platTrack(name, data);
          } catch (e) {
            console.error('埋点after执行异常', e);
          }
        },
      ].concat(args),
    )
    .call(this);
};
/**
 * @param {string} name
 * @param {object} data
 * @returns {any}
 * @description:方法后触发埋点，支持接受方法返回参数
 */
var afterTr = function afterTr(param) {
  for (
    var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1;
    _key4 < _len4;
    _key4++
  ) {
    args[_key4 - 1] = arguments[_key4];
  }
  return section.after.apply(
    section,
    [
      function () {
        try {
          for (
            var _len5 = arguments.length, arg = new Array(_len5), _key5 = 0;
            _key5 < _len5;
            _key5++
          ) {
            arg[_key5] = arguments[_key5];
          }
          var _evalFunc$call2 = evalFunc.call.apply(evalFunc, [this, param].concat(arg)),
            name = _evalFunc$call2.name,
            data = _evalFunc$call2.data;
          platTrack(name, data);
        } catch (e) {
          console.error('埋点after执行异常', e);
        }
      },
    ].concat(args),
  );
};
/**
 * @param {string} name
 * @param {object} data
 * @returns {any}
 * @description:单次方法后执行埋点
 */
var onceTr = function onceTr(param) {
  for (
    var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1;
    _key6 < _len6;
    _key6++
  ) {
    args[_key6 - 1] = arguments[_key6];
  }
  return section.after.apply(
    section,
    [
      section.once(function () {
        try {
          for (
            var _len7 = arguments.length, arg = new Array(_len7), _key7 = 0;
            _key7 < _len7;
            _key7++
          ) {
            arg[_key7] = arguments[_key7];
          }
          var _evalFunc$call3 = evalFunc.call.apply(evalFunc, [this, param].concat(arg)),
            name = _evalFunc$call3.name,
            data = _evalFunc$call3.data;
          platTrack(name, data);
        } catch (e) {
          console.error('埋点after执行异常', e);
        }
      }),
    ].concat(args),
  );
};
var platTrack = function platTrack(name, data) {
  console.log('触发埋点接口，参数：', name, data);
};
var index = _objectSpread2(
  {
    beforeTr: beforeTr,
    afterTr: afterTr,
    onceTr: onceTr,
  },
  section,
);

export default index;
export { ExposureTag, afterTr, beforeTr, decorFunc$1 as decorFunc, once$1 as once, onceTr };

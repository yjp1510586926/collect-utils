---
  nav:
    order: 1
    title:  埋点使用案例
    path: /
  title: 埋点使用案例
  group:
    path: /
    title: 埋点使用案例
    order: 1
---

github: https://github.com/yjp1510586926/collect-utils/tree/master

## 埋点使用案例 Class

Demo:

```jsx
import React from 'react';
import { Component } from 'react';
import { render } from 'react-dom';
import { decorFunc, beforeTr, afterTr, onceTr, ExposureTag } from 'track-utils-aop';
import { h5pv_b1u3v_ } from '../mock.js';

class ChildComponent extends React.Component {
  @decorFunc(beforeTr(h5pv_b1u3v_()))
  onClickBeforeButton() {
    console.log('onClickBeforeButton');
  }

  @decorFunc(
    afterTr({
      name: 'pcshow',
      data: {
        page_id: '1mwi',
        address_id: 'bf00',
      },
    }),
  )
  onClickAfterButton() {
    console.log('onClickAfterButton');
  }

  @decorFunc(
    afterTr((e, d) => {
      return { name: 'pcshow', data: { page_id: d, address_id: 'bf00' } };
    }),
  )
  onClickReturnDataAfterButton() {
    console.log('onClickReturnDataAfterButton');
    return '埋点返回数据';
  }

  @decorFunc(
    afterTr((e, d) => {
      return { name: 'pcshow', data: { page_id: d, address_id: 'bf00' } };
    }),
  )
  //   方案一
  //   async onClickAsyncReturnDataAfterButton() {
  //    const abb =  ()=> 5678
  //    return await abb()
  //   }
  //   方案二
  onClickAsyncReturnDataAfterButton() {
    return new Promise((resolve, reject) => {
      console.log('onClickAsyncReturnDataAfterButton');
      setTimeout(() => {
        resolve('异步埋点返回数据');
      }, 2000);
    });
  }

  @decorFunc(
    onceTr({
      name: 'pcshow',
      data: {
        page_id: '1mwi',
        address_id: 'bf00',
      },
    }),
  )
  onClickOnceButton() {
    console.log('onClick');
  }

  render() {
    return (
      <div>
        <button onClick={this.onClickBeforeButton}>beforeTr button</button>
        <br />
        <button onClick={this.onClickAfterButton}>afterTr button</button>
        <br />
        <button onClick={this.onClickReturnDataAfterButton}>return data button</button>
        <br />
        <button onClick={this.onClickAsyncReturnDataAfterButton}>async return data button</button>
        <br />
        <button onClick={this.onClickOnceButton}>once button</button>
        <br />
        向下滚动 查看曝光埋点
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <ExposureTag param={h5pv_b1u3v_()}>
          <div width="136px" height="178px">
            埋点标签
          </div>
          <div width="136px" height="178px">
            1
          </div>
        </ExposureTag>
      </div>
    );
  }
}

const App = () => (
  <>
    <ChildComponent />
  </>
);

export default App;
```

## 埋点使用案例 Func

Demo:

```jsx
import React, { useEffect, useState } from 'react';
import { decorFunc, beforeTr, afterTr, onceTr, ExposureTag } from 'track-utils-aop';
import { h5pv_b1u3v_ } from '../mock.js';

const App = () => {
  const [arr, setArr] = useState([]);
  const onClickBeforeButton = beforeTr(
    {
      name: 'pcshow',
      data: {
        page_id: '1mwi',
        address_id: 'bf00',
      },
    },
    () => {
      console.log('onClickBeforeButton');
    },
  );

  const onClickAfterButton = afterTr(
    {
      name: 'pcshow',
      data: {
        page_id: '1mwi',
        address_id: 'bf00',
      },
    },
    () => {
      setArr([]);
      console.log('onClickAfterButton');
    },
  );

  const onClickReturnDataAfterButton = afterTr(
    (e, d) => {
      return { name: 'pcshow', data: { page_id: d, address_id: 'bf00' } };
    },
    () => {
      console.log('onClickReturnDataAfterButton');
      return '埋点返回数据';
    },
  );

  const onClickAsyncReturnDataAfterButton = afterTr(
    (e, d) => {
      return { name: 'pcshow', data: { page_id: d, address_id: 'bf00' } };
    },
    () => {
      return new Promise((resolve, reject) => {
        console.log('onClickAsyncReturnDataAfterButton');
        setTimeout(() => {
          resolve('异步埋点返回数据');
        }, 2000);
      });
    },
  );

  const onClickOnceButton = onceTr(
    {
      name: 'pcshow',
      data: {
        page_id: '1mwi',
        address_id: 'bf00',
      },
    },
    () => {
      console.log('onClickOnceButton');
    },
  );

  useEffect(() => {
    setTimeout(() => {
      setArr([1, 1, 2, 4, 5, 6]);
    }, 5000);
  }, []);
  return (
    <div>
      <button onClick={onClickBeforeButton}>beforeTr button</button>
      <br />
      <button onClick={onClickAfterButton}>after button</button>
      <br />
      <button onClick={onClickReturnDataAfterButton}>return data button</button>
      <br />
      <button onClick={onClickAsyncReturnDataAfterButton}>async return data button</button>
      <br />
      <button onClick={onClickOnceButton}>once button</button>
      <br />
      <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      {arr.map((item, index) => {
        return (
          <ExposureTag param={h5pv_b1u3v_()} key={index} rootId="app">
            <div width="136px" height="178px">
              埋点标签{item}
            </div>
            <div width="136px" height="178px">
              1
            </div>
          </ExposureTag>
        );
      })}
    </div>
  );
};

export default App;
```

## 切面 Class 方法使用案例

Demo:

```jsx
import React from 'react';
import { Component } from 'react';
import { render } from 'react-dom';
import { decorFunc, before, after, once } from 'track-utils-aop';

class ChildComponent extends React.Component {
  @decorFunc(before(() => console.log('before【埋点】')))
  onClickBeforeButton() {
    console.log('onClickBeforeButton');
  }

  @decorFunc(after(() => console.log('after【埋点】')))
  onClickAfterButton() {
    console.log('onClickAfterButton');
  }

  @decorFunc(after((even, data) => console.log('after【埋点】', even, data)))
  onClickReturnDataAfterButton() {
    console.log('onClickReturnDataAfterButton');
    return '埋点返回数据';
  }

  @decorFunc(after((even, data) => console.log('after【埋点】', even, data)))
  //   方案一
  //   async onClickAsyncReturnDataAfterButton() {
  //    const abb =  ()=> 5678
  //    return await abb()
  //   }
  //   方案二
  onClickAsyncReturnDataAfterButton() {
    return new Promise((resolve, reject) => {
      console.log('onClickAsyncReturnDataAfterButton');
      setTimeout(() => {
        resolve('异步埋点返回数据');
      }, 2000);
    });
  }

  @decorFunc(before(once(() => console.log('once【埋点】'))))
  onClickOnceButton() {
    console.log('onClick');
  }

  render() {
    return (
      <div>
        <button onClick={this.onClickBeforeButton}>before button</button>
        <br />
        <button onClick={this.onClickAfterButton}>after button</button>
        <br />
        <button onClick={this.onClickReturnDataAfterButton}>return data button</button>
        <br />
        <button onClick={this.onClickAsyncReturnDataAfterButton}>async return data button</button>
        <br />
        <button onClick={this.onClickOnceButton}>once button</button>
        <br />
      </div>
    );
  }
}

const App = () => (
  <>
    <ChildComponent />
  </>
);

export default App;
```

## 切面 Func 方法使用案例

Demo:

```jsx
import React from 'react';
import { Component } from 'react';
import { render } from 'react-dom';
import { decorFunc, before, after, once } from 'track-utils-aop';

const App = () => {
  const onClickBeforeButton = before(
    () => {
      console.log(111);
    },
    () => {
      console.log(222);
    },
  );

  const onClickAfterButton = after(
    () => {
      console.log(111);
    },
    () => {
      console.log(222);
    },
  );

  const onClickReturnDataAfterButton = after(
    (e, d) => {
      console.log(222, e, d);
    },
    () => {
      console.log(111);
      return 123;
    },
  );

  const onClickAsyncReturnDataAfterButton = after(
    (e, d) => {
      console.log(222, e, d);
    },
    () => {
      console.log(111);
      return 123;
    },
  );

  const onClickOnceButton = after(
    once(() => {
      console.log(111);
    }),
    () => {
      console.log(222);
    },
  );

  return (
    <div>
      <button onClick={onClickBeforeButton}>before button</button>
      <br />
      <button onClick={onClickAfterButton}>after button</button>
      <br />
      <button onClick={onClickReturnDataAfterButton}>return data button</button>
      <br />
      <button onClick={onClickAsyncReturnDataAfterButton}>async return data button</button>
      <br />
      <button onClick={onClickOnceButton}>once button</button>
      <br />
    </div>
  );
};

export default App;
```

# harmless-js-error-list

汇集了常见的无害的脚本异常错误，提供为什么无害的解释，并且提供可供加载的script资源，你可以放心的将他们添加到你的监控ignore清单中。

## 无害清单

### The play() request was interrupted by a call

控制台的提示的具体信息为，它们是同样操作导致的，归属于iOS上的报错形式

1. The play() request was interrupted by a call to pause(). https://goo.gl/LdLk22

2. The play() request was interrupted by a new load request. https://goo.gl/LdLk22
The operation was aborted. 


plyr的作者在issue的评论：
> Will take a look but this is a minor bug as really all it does is log a message in the console. It doesn't actually effect functionality.
> This can be safely ignored.

https://github.com/sampotts/plyr/issues/1216


### ResizeObserver loop limit exceeded 

> This error means that ResizeObserver was not able to deliver all observations within a single animation frame. It is benign (your site will not break). – Aleksandar Totic

resizeobserver-loop-limit-exceeded 是一个良性报错，它表示ResizeObserver没能在一个animation frame中完成所有监听（[stackoverflow](https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded/58701523#58701523)）。


### useRequest has caught the exception

> 完整错误信息为：useRequest has caught the exception if you need to handle the exception yourself, you can set options.throwOnError to true.

Bigfish 会将请求失败（success为false）等结果，封装成error抛出去，错误被 ahooks 2 的 useRequest捕获到以后，按照上述的文案进行了reject处理（参考 [ahooks useRequest@2.x issue](https://github.com/alibaba/hooks/issues/757)，[ahooks useRequest@2.x code](https://github.com/alibaba/hooks/blob/v2.10.14/packages/use-request/src/useAsync.ts#L174)）

### Failed to execute 'transaction' on 'IDBDatabase': The database connection is closing. 

项目中使用AEM的插件，它调用IndexDB的API进行数据存取，出现上诉问题时并不影响业务系统的正常使用，反馈过给AEM的研发同学但是没有得到解决。可以将该错误其忽略。

### BizError

Bigfish/Umi技术架构下，对于success为false的接口，提供了钩子可以将它作为异常继续抛出去从方便调用位置的异常处理。
在本地生活IIC团队的基于umi扩展的脚手架unita中，我们将此类异常统一处理成了BizError（参考如下BizError的实现)。

```
  function BizError(message, code, config, request, response) {
    Error.call(this);
    this.message = message;
    this.name = 'BizError';
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
  }

  // BizError 原型继承 Error
  BizError.prototype = Object.create(Error.prototype);
  BizError.prototype.constructor = BizError;
```

由于对于接口异常已经有监控进行处理，因此可以将BizError也添加到ignore清单中。如下是基于AEM的监控提供的ignore函数。

```
  function (message, event, originEvent) {
    if (originEvent.type === 'unhandledrejection' && originEvent.reason && originEvent.reason.name === 'BizError') {
        return true;
    }
    return false;
  }
```

## 待证实清单

### ResizeObserver loop completed with undelivered notifications.

ResizeObserver loop completed with undelivered notifications 这个错误信息表明 ResizeObserver 的循环已经完成，但是有一些通知没有被传递出去。这通常意味着在浏览器的某个循环中，ResizeObserver 尝试触发回调，但是由于某些原因（比如页面正在卸载或者浏览器的某些限制），这些回调没有被执行。

这个错误本身通常不会影响页面的展示或用户的使用，因为它只是表明有未处理的通知，而不是说页面的布局或功能有问题。然而，如果这些未处理的通知是重要的，比如它们是用来更新页面布局的，那么它们可能会间接影响到用户体验。

### Uncaught Error: 0

axios抛出接口异常会体现为这个异常日志，但不清楚是否有其他场景也会是这个日志。

## 客户端报错

如果你的应用是作为三方H5在客户端运行，那么客户端注入的代码运行报错不受控制，可以忽略。

### 客如云的报错

```
Uncaught TypeError: window.kmobile.onResume is not a function
ReferenceError: Can't find variable: registerImageClickAction
``` 

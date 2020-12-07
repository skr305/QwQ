

class HD {
    static PENDING = "pending";
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";
    constructor(executor) {
        this.callbacks = [];
      this.status = HD.PENDING;
      this.value = null;
      try {
        //为什么这部分要绑定呢
        //到底什么时候要绑定呢?
        //这个exe是一个函数 前台把函数传进来
        //前台的函数一般写起来有两个形参
        //调用函数时 把这个类本身的这两个函数给传进去
        //似乎是this会发生变化?
        //然后它去执行 执行的过程中
        //会出现resolve(xx)/reject(xx)
        //
        executor(this.resolve.bind(this), this.reject.bind(this));
      } catch (error) {
        this.reject(error);
      }
    }
    resolve(value) {
        if (this.status == HD.PENDING) {
          this.status = HD.FULFILLED;
          this.value = value;
          this.callbacks.map(callback => {
            callback.onFulfilled(value);
          });
        }
      }
      reject(value) {
        if (this.status == HD.PENDING) {
          this.status = HD.REJECTED;
          this.value = value;
          this.callbacks.map(callback => {
            callback.onRejected(value);
          });
        }
      }


      then(onFulfilled, onRejected) {
        if (typeof onFulfilled != "function") {
          onFulfilled = value => value;
        }
        if (typeof onRejected != "function") {
          onRejected = value => value;
        }
        //说白了 promise构造函数的参数
        //就是一个函数 而promise事实上就是允许你
        //根据某个异步操作的成功/失败做对应的后续的事情
        //具有动态规划的能力 
        //而事实上 then函数本身也正对应了根据前面的异步操作
        //的结果作出对应事情的操作(可能是写入信息) 本身也是一个操作
        //那么我们也可以给这段操作本身添加对应的后续操作
        //这就是嵌套then的机制吧..
        return new HD((resolve, reject) => {
          if (this.status == HD.PENDING) {
              //交给顶端调用栈来进行
              //也就是说 resolve/reject之后 这两个函数
              //才会被执行 这点在promise执行体
              //是同步的时候看不出来的
              //但如果是异步的话 这么做等于是转交了
              //后序方法的调用权 resolve相当于是发一个
              //成功信号 在resolve中调用等于
              //是在人为确定成功之后再调用对应的后续操作
              //这样的话then和promise中执行体相对的顺序就出来了
            this.callbacks.push({
              onFulfilled: value => {
                try {
                  let result = onFulfilled(value);
                  resolve(result);
                } catch (error) {
                  reject(error);
                }
              },
              onRejected: value => {
                try {
                  let result = onRejected(value);
                  resolve(result);
                } catch (error) {
                  reject(error);
                }
              }
            });
          }
          if (this.status == HD.FULFILLED) {
            setTimeout(() => {
              try {
                let result = onFulfilled(this.value);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            });
          }
          if (this.status == HD.REJECTED) {
            setTimeout(() => {
              try {
                let result = onRejected(this.value);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            });
          }
        });
      }
  }



  let web = "后盾人";
[web, url] = ["hdcms.com", "houdunren.com"];
console.log(web);





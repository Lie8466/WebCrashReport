/**
* @author: liyawei03
* @file: description
* @Date: 2020-08-26 14:40:32
* @LastEditors: liyawei03
* @LastEditTime: 2020-08-26 14:51:38
 */
const CHECK_CRASH_INTERVAL = 10 * 1000; // 每 10s 检查一次
const CRASH_THRESHOLD = 15 * 1000; // 15s 超过15s没有心跳则认为已经 crash
const pages = {}
let timer;

function selfConsole(str) {
  console.log('---sw.js:' + str) ;
}


function send(data) {
  // @IMP: 此处不能使用XMLHttpRequest
  // https://stackoverflow.com/questions/38393126/service-worker-and-ajax/38393563
  fetch('/save-data', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(function (data) {
   selfConsole('Request succeeded with JSON response', data);
  })
  .catch(function (error) {
    selfConsole('Request failed', error);
  });
}

function checkCrash(data) {
  const now = Date.now()
  for (var id in pages) {
    let page = pages[id]
    if ((now - page.t) > CRASH_THRESHOLD) {
      // 上报 crash
      delete pages[id]
      send({
        appName: data.key,
        attributes: {
          env: data.env || 'production',
          pageUrl: location.href,
          ua: navigator.userAgent,
          msg: 'crashed',
          content: '22222'
        },
        localDateTime: +new Date()
      });
    }
  }
  if (Object.keys(pages).length == 0) {
    clearInterval(timer)
    timer = null
  }
}

self.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === 'heartbeat') {
    pages[data.id] = {
      t: Date.now()
    }
    selfConsole('recieved heartbeat')
    selfConsole(JSON.stringify(pages));
    if (!timer) {
      timer = setInterval(function () {
        selfConsole('checkcrash');
        checkCrash(e.data.data)
      }, CHECK_CRASH_INTERVAL)
    }
  } else if (data.type === 'unload') {
    selfConsole('recieved unloaded')
    delete pages[data.id]
  }
})

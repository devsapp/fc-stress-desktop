import FcStressComponent from '../src/index';

const ins: FcStressComponent = new FcStressComponent();
ins.start({
  region: 'cn-shanghai',
  access: 'default',
  url: 'https://xxx.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/qianfeng-demo/node-http/',
  method: 'GET',
  payload: 'Hello Serverless',
  functionType: 'http',
  numUser: 6,
  spawnRate: 10,
  runningTime: 30,
}).then(() => console.log('done'));

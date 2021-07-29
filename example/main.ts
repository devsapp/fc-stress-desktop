import FcStressComponent from '../lib/index';

const ins: FcStressComponent = new FcStressComponent();
ins.start({
  region: 'cn-hangzhou',
  access: 'default',
  url: 'http://todo-list.todo-list-service.xxx.cn-hangzhou.fc.devsapp.net',
  method: 'GET',
  payload: 'Hello Serverless',
  functionType: 'http',
  numUser: 6,
  spawnRate: 10,
  runningTime: 30,
}).then(() => console.log('done'));

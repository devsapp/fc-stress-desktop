import { ICredentials, IProperties } from '../common/entity';
import { FcClient } from './fc';
import * as path from 'path';
import AlicloudRam from './ram';
import { ServerlessProfile, IInputsBase } from './profile';
import logger from '../common/logger';
import * as yaml from 'js-yaml';
import os from 'os';
import * as fse from 'fs-extra';
import { HttpTypeOption, EventTypeOption, StressOption } from './interface';
import _ from 'lodash';
import * as rimraf from 'rimraf';
import tryRequire from 'try-require';
import sd from 'silly-datetime';
const pkg = tryRequire(path.join(__dirname, '..', '..', 'package.json'));
const VERSION: string = pkg?.version || '0.0.0';

export class FcStress extends IInputsBase{
  private readonly httpTypeOpts?: HttpTypeOption;
  private readonly eventTypeOpts?: EventTypeOption;
  private readonly stressOpts?: StressOption;
  private readonly fcClient: FcClient;

  private static readonly supportedFunctionTypes: string[] = ['event', 'http'];
  private static readonly defaultCacheDir: string = path.join(os.homedir(), '.s', 'cache', 'fc-stress');
  private static readonly defaultVersionCacheDir: string = path.join(FcStress.defaultCacheDir, VERSION);
  private static readonly defaultHtmlCacheDir: string = path.join(FcStress.defaultCacheDir, 'html');
  // 辅助函数被部署过的 region 列表，表示在目标 region 已经部署过该版本组件对应的辅助函数
  private static readonly helperFunctionDeployedRegionFile: string = path.join(FcStress.defaultVersionCacheDir, 'region.json');
  private static readonly defaultServiceName: string = `_DEFAULT_FC_STRESS_COMPONENT_SERVICE`;
  private static readonly defaultRoleName: string = `DEFAULT-FC-STRESS-COMPONENT-ROLE`;
  private static readonly defaultFunctionProp: any = {
    functionName: `_DEFAULT_FC_STRESS_COMPONENT_SERVICE`,
    serviceName: FcStress.defaultServiceName,
    handler: 'index.handler',
    runtime: 'python3',
    codeUri: path.join(__dirname, 'utils', 'stress_test'),
    memorySize: 3072,
    timeout: 600,
    environmentVariables: {
      PATH: "/code/.s/root/usr/local/bin:/code/.s/root/usr/local/sbin:/code/.s/root/usr/bin:/code/.s/root/usr/sbin:/code/.s/root/sbin:/code/.s/root/bin:/code:/code/node_modules/.bin:/code/.s/python/bin:/code/.s/node_modules/.bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/sbin:/bin",
      PYTHONUSERBASE: "/code/.s/python",
      TZ: "Asia/Shanghai"
    }
  }
  private static readonly defaultStressOpts: StressOption = {
    functionType: '',
    numUser: 6,
    spawnRate: 10,
    runningTime: 30
  }

  constructor(serverlessProfile: ServerlessProfile, creds: ICredentials, region: string, stressOpts?: StressOption, httpTypeOpts?: HttpTypeOption, eventTypeOpts?: EventTypeOption, curPath?: string, args?: string) {
    super(serverlessProfile, region, creds, curPath, args);

    this.stressOpts = stressOpts;
    if (this.stressOpts) {
      this.stressOpts.numUser = this.stressOpts.numUser || FcStress.defaultStressOpts.numUser;
      this.stressOpts.spawnRate = this.stressOpts.spawnRate || FcStress.defaultStressOpts.spawnRate;
      this.stressOpts.runningTime = this.stressOpts.runningTime || FcStress.defaultStressOpts.runningTime;
      logger.info(`Using stress options: \n${yaml.dump(this.stressOpts)}`);
    }
    this.httpTypeOpts = httpTypeOpts;
    this.eventTypeOpts = eventTypeOpts;
    this.fcClient = new FcClient(this.region, this.credentials);
  }

  public validate(): boolean {
    if (this.stressOpts) {
      const functionType: string = this.stressOpts.functionType;
      if (!functionType) {
        logger.error(`Please input function type!`);
        return false;
      }
      if (!_.includes(FcStress.supportedFunctionTypes, functionType)) {
        logger.error(`Unsupported function type: ${functionType}`);
        return false;
      }
    }
    return true;
  }

  private async makeHelperFunction(roleArn: string): Promise<void> {
    const defaultServiceProp: any = {
      serviceName: FcStress.defaultServiceName,
      role: roleArn
    };
    await this.fcClient.makeService(defaultServiceProp);
    await this.fcClient.makeFunction(FcStress.defaultFunctionProp);
  }

  private async removeHelperFunction(): Promise<void> {
    await this.fcClient.removeFunction(FcStress.defaultServiceName, FcStress.defaultFunctionProp.functionName);
    await this.fcClient.removeService(FcStress.defaultServiceName);
  }

  private async makeServiceRole(): Promise<string> {
    const ramProperty: IProperties = {
      name: FcStress.defaultRoleName,
      service: "fc.aliyuncs.com",
      description: `Default role generated by fc-stress component`,
      statement: null,
      policies: ['AliyunFCInvocationAccess']
    };
    const ram = new AlicloudRam(this.credentials);
    const roleArn: string = await ram.deploy(ramProperty);
    return roleArn;
  }

  public async init() {
    if (await this.checkIfNecessaryToDeployHelper()) {
      // 初始化所需的角色
      const roleArn: string = await this.makeServiceRole();
      // 部署辅助函数
      await this.makeHelperFunction(roleArn);
      await this.makeHelpFunctionDeployedRegionFile();
    }
  }

  private async checkIfNecessaryToDeployHelper(): Promise<boolean> {
    /*
    两种情况需要部署辅助函数:
    1. 线上辅助资源不存在
    2. 该版本组件对应的辅助函数未被部署过
    */

    if (!await this.fcClient.checkIfFunctionExist(FcStress.defaultServiceName, FcStress.defaultFunctionProp.functionName)) {
      logger.debug(`Helper function not exist online.`)
      return true;
    }
    if (!await fse.pathExists(FcStress.helperFunctionDeployedRegionFile)) {
      logger.debug(`${FcStress.helperFunctionDeployedRegionFile} not exist.`);
      return true;
    }
    const regionList: string[] = JSON.parse(await fse.readFile(FcStress.helperFunctionDeployedRegionFile, { encoding: 'utf-8',  }));
    logger.debug(`Deployed region list: ${regionList}`);
    if (!_.includes(regionList, this.region)) {
      logger.debug(`The version of helper function has not been deployed in the region: ${this.region}`);
      return true;
    }
    return false;
  }

  private async makeHelpFunctionDeployedRegionFile(): Promise<void> {
    await fse.ensureDir(path.dirname(FcStress.helperFunctionDeployedRegionFile));
    let regionList: string[] = [];
    if (await fse.pathExists(FcStress.helperFunctionDeployedRegionFile)) {
      // append
      regionList = JSON.parse(await fse.readFile(FcStress.helperFunctionDeployedRegionFile, { encoding: 'utf-8',  }));
    }
    regionList.push(this.region);
    logger.debug(`Newly region list: ${regionList}`);
    await fse.writeFile(FcStress.helperFunctionDeployedRegionFile, JSON.stringify(regionList), {flag: 'w', mode: 0o777});
  }

  public async invoke(): Promise<any> {
    const event: any = {
      NUM_USERS: this.stressOpts.numUser,
      SPAWN_RATE: this.stressOpts.spawnRate,
      RUN_TIME: this.stressOpts.runningTime,
      REPORT_HTML: true,
      functionType: this.stressOpts.functionType,
    };

    if (this.isEventFunctionType()) {
      Object.assign(event, this.eventTypeOpts);
    } else if (this.isHttpFunctionType) {
      Object.assign(event, this.httpTypeOpts);
    }
    logger.debug(`Event of invoking function is: \n${yaml.dump(event)}`);
    const invokeRes: any = await this.fcClient.invokeFunction(FcStress.defaultServiceName, FcStress.defaultFunctionProp.functionName, JSON.stringify(event));
    return invokeRes;
  }

  public isEventFunctionType(): boolean {
    return this.stressOpts.functionType === 'event';
  }

  public isHttpFunctionType(): boolean {
    return this.stressOpts.functionType === 'http';
  }

  public async showHtmlReport(data: any): Promise<void> {
    const htmlContent: string = data.report_html;
    await fse.ensureDir(FcStress.defaultHtmlCacheDir);
    let cacheHtmlFileName: string;
    const curTimestamp: string = sd.format(new Date(), 'YYYY-MM-DDTHH-mm-ss');
    if (this.isEventFunctionType()) {
      cacheHtmlFileName = `${this.eventTypeOpts.serviceName}.${this.eventTypeOpts.qualifier}-${this.eventTypeOpts.functionName}#${curTimestamp}.html`;
    } else if (this.isHttpFunctionType()) {
      cacheHtmlFileName = `url#${curTimestamp}.html`;
    }
    const cacheHtmlFilePath: string = path.join(FcStress.defaultHtmlCacheDir, cacheHtmlFileName || '');
    await fse.writeFile(cacheHtmlFilePath, htmlContent, {flag: 'w'});
    logger.log(`Html report flie: ${cacheHtmlFilePath}\nExecute 'open ${cacheHtmlFilePath}' on macos for html report with browser.`, 'yellow');
  }

  public async clean(assumeYes?: boolean): Promise<any> {
    // 删除辅助函数
    await this.removeHelperFunction();
    // TODO：删除 role
    // 删除 html 文件
    rimraf.sync(FcStress.defaultHtmlCacheDir);
  }

  public processError(data: any): any {
    if (data?.errorMessage) {
      if (data?.errorMessage.includes(`[Errno 2] No such file or directory: '/tmp/report.html'`)) {
        throw new Error(`Invalid format of payload.`);
      }
      throw new Error(`Helper function error type: ${data?.errorType}, error message: ${data?.errorMessage}`);
    }
    if (_.isString(data) && _.toLower(data).includes('error')) {
      throw new Error(data);
    }
  }
}

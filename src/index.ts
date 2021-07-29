import logger from './common/logger';
import { ICredentials } from './common/entity';
import * as _ from 'lodash';
import * as core from '@serverless-devs/core';
import { FcStress } from './lib/stress';
import { ServerlessProfile } from './lib/profile';
import { HttpTypeOption, EventTypeOption, StressOption } from './lib/interface';
import { payloadPriority } from './lib/utils/file';

export default class FcStressComponent {

  private async report(componentName: string, command: string, accountID?: string, access?: string): Promise<void> {
    let uid: string = accountID;
    if (_.isEmpty(accountID)) {
      try {
        const credentials: ICredentials = await core.getCredential(access);
        uid = credentials.AccountID;
      } catch (e) {
        logger.warning(`Getting credential failed, access is ${access}`);
        logger.debug(`Get credentials error: ${e}`);
      }

    }
    core.reportComponent(componentName, {
      command,
      uid,
    }).catch((e) => {
      logger.warning(`Component report failed, component name: ${componentName}, method: ${command}`);
      logger.debug(`Report component error: ${e}`);
    });
  }

  /**
   * start stress test
   * @param inputs
   * @returns
   */
  public async start(inputs: any): Promise<any> {
    const {
      region, access, qualifier, url, method,
      payload, functionName, serviceName, functionType,
      numUser, spawnRate, runningTime, payloadFile
    } = inputs;
    await this.report('fc-stress', 'stress', null, access);
    const creds: ICredentials = await core.getCredential(access);

    const serverlessProfile: ServerlessProfile = {
      project: {
        access,
        projectName: inputs?.project?.projectName
      },
      appName: inputs?.appName
    };
    const stressOpts: StressOption = {
      numUser,
      spawnRate,
      runningTime,
      functionType
    };
    logger.info(`Reading payload content...`)
    const payloadContent = await payloadPriority(payload, payloadFile);

    let httpTypeOpts: HttpTypeOption = null;
    let eventTypeOpts: EventTypeOption = null;
    if (functionType === 'event') {
      eventTypeOpts = Object.assign({}, {
        serviceName,
        functionName,
        qualifier: qualifier || "LATEST",
        payload: payloadContent
      });
    } else if (functionType === 'http') {
      httpTypeOpts = Object.assign({}, {
        url,
        method,
        body: payloadContent
      });
    }
    const fcStress: FcStress = new FcStress(serverlessProfile, creds, region, stressOpts, httpTypeOpts, eventTypeOpts, inputs?.path?.configPath);
    if (!fcStress.validate()) {
      return;
    }
    // 部署辅助函数
    logger.info(`Preparing helper reource for stress test.`);
    await fcStress.init();
    // 调用函数
    let invokeRes: any;
    const stressVm = core.spinner(`Stress test...`);
    try {
      invokeRes = await fcStress.invoke();
      stressVm.succeed(`Stress test complete.`);
    } catch (e) {
      stressVm.fail(`Stress test error.`);
      throw e;
    }

    // 展示结果
    let data: any = invokeRes?.data;
    
    if (_.isString(data)) {
      data = JSON.parse(data);
    }
    fcStress.processError(data);
    logger.info(`Displaying the result of stress test.`);
    await fcStress.showHtmlReport(data);

    delete data.report_html;
    return data;
  }

  /**
   * clean stress helper function and html report file
   * @param inputs
   * @returns
   */
   public async clean(inputs: any): Promise<any> {
    const {
      region, access, assumeYes
    } = inputs;
    const creds: ICredentials = await core.getCredential(access);
    await this.report('fc-stress', 'clean', null, access);
    
    const serverlessProfile: ServerlessProfile = {
      project: {
        access,
        projectName: inputs?.project?.projectName
      },
      appName: inputs?.appName
    };
    const fcStress: FcStress = new FcStress(serverlessProfile, creds, region, null, null, null, inputs?.path?.configPath);

    logger.info(`Cleaning helper resource and local html report files...`);
    await fcStress.clean(assumeYes);
  }

}

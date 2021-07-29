import inquirer from 'inquirer';
import * as yaml from 'js-yaml';
import { Logger } from '@serverless-devs/core';

function isInteractiveEnvironment(): boolean {
  return process.stdin.isTTY;
}



export async function promptForConfirmOrDetails(message: string, details: any): Promise<boolean> {
  if (!isInteractiveEnvironment()) {
    return true;
  }

  Logger.log(`
  ${yaml.dump({ detail: details })}`);

  const answers: any = await inquirer.prompt([{
    type: 'list',
    name: 'prompt',
    message,
    choices: ['yes', 'no'],
  }]);

  return answers.prompt === 'yes';
}

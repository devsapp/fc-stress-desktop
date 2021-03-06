
import i18n from './i18n';
import { Logger } from '@serverless-devs/core';

export default class ComponentLogger {
    static CONTENT = 'FC-STRESS';
    static setContent(content) {
        ComponentLogger.CONTENT = content;
    }
    static log(m, c?: any) {
        Logger.log(i18n.__(m) || m, c);
    }
    static info(m) {
        Logger.info(ComponentLogger.CONTENT, i18n.__(m) || m);
    }

    static debug(m) {
        Logger.debug(ComponentLogger.CONTENT, i18n.__(m) || m);
    }

    static error(m) {
        Logger.error(ComponentLogger.CONTENT, i18n.__(m) || m);
    }

    static warning(m) {
        Logger.warn(ComponentLogger.CONTENT, i18n.__(m) || m);
    }


    static success(m) {
        Logger.log(i18n.__(m) || m, 'green');
    }

}




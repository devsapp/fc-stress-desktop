export interface ICredentials {
    AccountID: string,
    AccessKeyID: string,
    AccessKeySecret: string,
    SecurityToken?: string;
  }
  export interface InputProps {
    props: IProperties, // 用户自定义输入
    credentials: ICredentials, // 用户秘钥
    appName: string, // 
    project: {
      component: string, // 组件名（支持本地绝对路径）
      access: string, // 访问秘钥名
      projectName: string, // 项目名
    },
    command: string, // 执行指令
    args: string, // 命令行 扩展参数
    path: {
      configPath: string // 配置路径
    }
  }
  
  
  
  export interface IProperties {
    name: string;
    service?: string;
    description?: string;
    statement?: IStatement[];
    policies: Array<string | IPolicy>;
  }
  
  export interface IPolicy {
    name: string;
    description?: string;
    statement: IStatement[];
  }
  
  interface IStatement {
    Effect: 'Allow' | 'Deny';
    Action: string[];
    Resource?: string | string[];
    Condition?: string | string[] | object;
    Principal?: object;
    Permission?: 'Allow' | 'Deny';
  }
  
  export interface IRoleDocument {
    Version: string;
    Statement: any;
  }
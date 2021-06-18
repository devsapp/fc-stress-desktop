"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcStress = void 0;
var fc_1 = require("./fc");
var path = __importStar(require("path"));
var ram_1 = require("./component/ram");
var profile_1 = require("./profile");
var core = __importStar(require("@serverless-devs/core"));
var logger_1 = __importDefault(require("../common/logger"));
var yaml = __importStar(require("js-yaml"));
var os_1 = __importDefault(require("os"));
var fse = __importStar(require("fs-extra"));
var stdout_formatter_1 = __importDefault(require("./component/stdout-formatter"));
var prompt_1 = require("./utils/prompt");
var lodash_1 = __importDefault(require("lodash"));
var rimraf = __importStar(require("rimraf"));
var FcStress = /** @class */ (function (_super) {
    __extends(FcStress, _super);
    function FcStress(serverlessProfile, creds, region, stressOpts, httpTypeOpts, eventTypeOpts, curPath, args) {
        var _this = _super.call(this, serverlessProfile, region, creds, curPath, args) || this;
        _this.stressOpts = stressOpts;
        if (_this.stressOpts) {
            _this.stressOpts.numUser = _this.stressOpts.numUser || FcStress.defaultStressOpts.numUser;
            _this.stressOpts.spawnRate = _this.stressOpts.spawnRate || FcStress.defaultStressOpts.spawnRate;
            _this.stressOpts.runningTime = _this.stressOpts.runningTime || FcStress.defaultStressOpts.runningTime;
            logger_1.default.info(stdout_formatter_1.default.stdoutFormatter.using('stress options', "\n" + yaml.dump(_this.stressOpts)));
        }
        _this.httpTypeOpts = httpTypeOpts;
        _this.eventTypeOpts = eventTypeOpts;
        _this.fcClient = new fc_1.FcClient(_this.region, _this.credentials);
        return _this;
    }
    FcStress.prototype.validate = function () {
        if (this.stressOpts) {
            var functionType = this.stressOpts.functionType;
            if (!lodash_1.default.includes(FcStress.supportedFunctionTypes, functionType)) {
                logger_1.default.error("Unsupported function type: " + functionType);
                return false;
            }
        }
        return true;
    };
    FcStress.prototype.makeHelperFunction = function (roleArn) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultServiceProp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultServiceProp = {
                            serviceName: FcStress.defaultServiceName,
                            role: roleArn
                        };
                        return [4 /*yield*/, this.fcClient.makeService(defaultServiceProp)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.fcClient.makeFunction(FcStress.defaultFunctionProp)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.removeHelperFunction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fcClient.removeFunction(FcStress.defaultServiceName, FcStress.defaultFunctionProp.functionName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.fcClient.removeService(FcStress.defaultServiceName)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.makeServiceRole = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var profileOfRam, ramComponent, ramComponentInputs, ramComponentIns, roleArn;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        logger_1.default.debug(stdout_formatter_1.default.stdoutFormatter.set('role for helper service', FcStress.defaultRoleName));
                        profileOfRam = profile_1.replaceProjectName(this.serverlessProfile, ((_b = (_a = this.serverlessProfile) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.projectName) + "-ram-project");
                        ramComponent = new ram_1.RamComponent(profileOfRam, {
                            roleName: FcStress.defaultRoleName,
                            resourceName: "fc.aliyuncs.com",
                            assumeRolePolicy: null,
                            attachedPolicies: ['AliyunFCInvocationAccess'],
                            description: "Default role generated by fc-stress component",
                        }, this.region, this.credentials, this.curPath, this.args);
                        ramComponentInputs = ramComponent.genComponentInputs('ram');
                        return [4 /*yield*/, core.load('devsapp/ram')];
                    case 1:
                        ramComponentIns = _c.sent();
                        return [4 /*yield*/, ramComponentIns.deploy(ramComponentInputs)];
                    case 2:
                        roleArn = _c.sent();
                        return [2 /*return*/, roleArn];
                }
            });
        });
    };
    FcStress.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roleArn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkIfNecessaryToDeployHelper()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.makeServiceRole()];
                    case 2:
                        roleArn = _a.sent();
                        // 部署辅助函数
                        return [4 /*yield*/, this.makeHelperFunction(roleArn)];
                    case 3:
                        // 部署辅助函数
                        _a.sent();
                        return [4 /*yield*/, this.makeHelpFunctionDeployedRegionFile()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.checkIfNecessaryToDeployHelper = function () {
        return __awaiter(this, void 0, void 0, function () {
            var regionList, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.fcClient.checkIfFunctionExist(FcStress.defaultServiceName, FcStress.defaultFunctionProp.functionName)];
                    case 1:
                        /*
                        两种情况需要部署辅助函数:
                        1. 线上辅助资源不存在
                        2. 该版本组件对应的辅助函数未被部署过
                        */
                        if (!(_c.sent())) {
                            logger_1.default.debug("Helper function not exist online.");
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, fse.pathExists(FcStress.helperFunctionDeployedRegionFile)];
                    case 2:
                        if (!(_c.sent())) {
                            logger_1.default.debug(FcStress.helperFunctionDeployedRegionFile + " not exist.");
                            return [2 /*return*/, true];
                        }
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, fse.readFile(FcStress.helperFunctionDeployedRegionFile, { encoding: 'utf-8', })];
                    case 3:
                        regionList = _b.apply(_a, [_c.sent()]);
                        logger_1.default.debug("Deployed region list: " + regionList);
                        if (!lodash_1.default.includes(regionList, this.region)) {
                            logger_1.default.debug("The version of helper function has not been deployed in the region: " + this.region);
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    FcStress.prototype.makeHelpFunctionDeployedRegionFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var regionList, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fse.ensureDir(FcStress.defaultCacheDir)];
                    case 1:
                        _c.sent();
                        regionList = [];
                        return [4 /*yield*/, fse.pathExists(FcStress.helperFunctionDeployedRegionFile)];
                    case 2:
                        if (!_c.sent()) return [3 /*break*/, 4];
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, fse.readFile(FcStress.helperFunctionDeployedRegionFile, { encoding: 'utf-8', })];
                    case 3:
                        // append
                        regionList = _b.apply(_a, [_c.sent()]);
                        _c.label = 4;
                    case 4:
                        regionList.push(this.region);
                        logger_1.default.debug("Newly region list: " + regionList);
                        return [4 /*yield*/, fse.writeFile(FcStress.helperFunctionDeployedRegionFile, JSON.stringify(regionList), { flag: 'w', mode: 511 })];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.invoke = function () {
        return __awaiter(this, void 0, void 0, function () {
            var event, invokeRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event = {
                            NUM_USERS: this.stressOpts.numUser,
                            SPAWN_RATE: this.stressOpts.spawnRate,
                            RUN_TIME: this.stressOpts.runningTime,
                            REPORT_HTML: true,
                            functionType: this.stressOpts.functionType,
                        };
                        if (this.isEventFunctionType()) {
                            Object.assign(event, this.eventTypeOpts);
                        }
                        else if (this.isHttpFunctionType) {
                            Object.assign(event, this.httpTypeOpts);
                        }
                        logger_1.default.debug("Event of invoking function is: \n" + yaml.dump(event));
                        return [4 /*yield*/, this.fcClient.invokeFunction(FcStress.defaultServiceName, FcStress.defaultFunctionProp.functionName, JSON.stringify(event))];
                    case 1:
                        invokeRes = _a.sent();
                        return [2 /*return*/, invokeRes];
                }
            });
        });
    };
    FcStress.prototype.isEventFunctionType = function () {
        return this.stressOpts.functionType === 'event';
    };
    FcStress.prototype.isHttpFunctionType = function () {
        return this.stressOpts.functionType === 'http';
    };
    FcStress.prototype.showHtmlReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var htmlContent, cacheHtmlFileName, curTimestamp, cacheHtmlFilePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        htmlContent = data.report_html;
                        return [4 /*yield*/, fse.ensureDir(FcStress.defaultHtmlCacheDir)];
                    case 1:
                        _a.sent();
                        curTimestamp = new Date().toISOString();
                        if (this.isEventFunctionType()) {
                            cacheHtmlFileName = this.eventTypeOpts.serviceName + "." + this.eventTypeOpts.qualifier + "-" + this.eventTypeOpts.functionName + "#" + curTimestamp + ".html";
                        }
                        else if (this.isHttpFunctionType()) {
                            cacheHtmlFileName = "url#" + curTimestamp;
                        }
                        cacheHtmlFilePath = path.join(FcStress.defaultHtmlCacheDir, cacheHtmlFileName || '');
                        return [4 /*yield*/, fse.writeFile(cacheHtmlFilePath, htmlContent, { mode: 511, flag: 'w' })];
                    case 2:
                        _a.sent();
                        logger_1.default.log("Html report flie: " + cacheHtmlFilePath + "\nOpen it for html report with browser.", 'yellow');
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.clean = function (assumeYes) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // 删除辅助函数
                    return [4 /*yield*/, this.removeHelperFunction()];
                    case 1:
                        // 删除辅助函数
                        _b.sent();
                        msg = "Are you sure to remove all the history html report files under " + FcStress.defaultHtmlCacheDir + "?";
                        _a = assumeYes;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, prompt_1.promptForConfirmContinue(msg)];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        if (_a) {
                            rimraf.sync(FcStress.defaultHtmlCacheDir);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.processError = function (data) {
        if (data === null || data === void 0 ? void 0 : data.errorMessage) {
            if (data === null || data === void 0 ? void 0 : data.errorMessage.includes("[Errno 2] No such file or directory: '/tmp/report.html'")) {
                throw new Error("Invalid format of payload.");
            }
            throw new Error("Helper function error type: " + (data === null || data === void 0 ? void 0 : data.errorType) + ", error message: " + (data === null || data === void 0 ? void 0 : data.errorMessage));
        }
    };
    FcStress.supportedFunctionTypes = ['event', 'http'];
    FcStress.defaultCacheDir = path.join(os_1.default.homedir(), '.s', 'cache', 'fc-stress');
    FcStress.defaultHtmlCacheDir = path.join(FcStress.defaultCacheDir, 'html');
    // 辅助函数被部署过的 region 列表，表示在目标 region 已经部署过该版本组件对应的辅助函数
    FcStress.helperFunctionDeployedRegionFile = path.join(FcStress.defaultCacheDir, 'region.json');
    FcStress.defaultServiceName = "_DEFAULT_FC_STRESS_COMPONENT_SERVICE";
    FcStress.defaultRoleName = "DEFAULT-FC-STRESS-COMPONENT-ROLE";
    FcStress.defaultFunctionProp = {
        functionName: "_DEFAULT_FC_STRESS_COMPONENT_SERVICE",
        serviceName: FcStress.defaultServiceName,
        handler: 'index.handler',
        runtime: 'python3',
        codeUri: path.join(__dirname, 'utils', 'stress_test', 'code.zip'),
        memorySize: 3072,
        timeout: 600,
        environmentVariables: {
            PATH: "/code/.s/root/usr/local/bin:/code/.s/root/usr/local/sbin:/code/.s/root/usr/bin:/code/.s/root/usr/sbin:/code/.s/root/sbin:/code/.s/root/bin:/code:/code/node_modules/.bin:/code/.s/python/bin:/code/.s/node_modules/.bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/sbin:/bin",
            PYTHONUSERBASE: "/code/.s/python"
        }
    };
    FcStress.defaultStressOpts = {
        functionType: '',
        numUser: 6,
        spawnRate: 10,
        runningTime: 30
    };
    return FcStress;
}(profile_1.IInputsBase));
exports.FcStress = FcStress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zdHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyQkFBZ0M7QUFDaEMseUNBQTZCO0FBQzdCLHVDQUErQztBQUMvQyxxQ0FBK0U7QUFDL0UsMERBQThDO0FBQzlDLDREQUFzQztBQUN0Qyw0Q0FBZ0M7QUFDaEMsMENBQW9CO0FBQ3BCLDRDQUFnQztBQUNoQyxrRkFBMkQ7QUFFM0QseUNBQTBEO0FBQzFELGtEQUF1QjtBQUN2Qiw2Q0FBaUM7QUFFakM7SUFBOEIsNEJBQVc7SUFpQ3ZDLGtCQUFZLGlCQUFvQyxFQUFFLEtBQW1CLEVBQUUsTUFBYyxFQUFFLFVBQXlCLEVBQUUsWUFBNkIsRUFBRSxhQUErQixFQUFFLE9BQWdCLEVBQUUsSUFBYTtRQUFqTixZQUNFLGtCQUFNLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQVl2RDtRQVZDLEtBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksS0FBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDO1lBQ3hGLEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUM7WUFDOUYsS0FBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQztZ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
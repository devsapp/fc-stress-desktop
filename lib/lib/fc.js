"use strict";
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
exports.FcClient = void 0;
var fc2_1 = __importDefault(require("@alicloud/fc2"));
var logger_1 = __importDefault(require("../common/logger"));
var path = __importStar(require("path"));
var os_1 = __importDefault(require("os"));
var fse = __importStar(require("fs-extra"));
var zip_1 = require("./zip");
var stdout_formatter_1 = __importDefault(require("./component/stdout-formatter"));
var FcClient = /** @class */ (function () {
    function FcClient(region, creds, timeout) {
        this.client = new fc2_1.default(creds.AccountID, {
            accessKeyID: creds.AccessKeyID,
            accessKeySecret: creds.AccessKeySecret,
            securityToken: creds.SecurityToken,
            region: region,
            timeout: timeout || FcClient.defaultTimeout,
        });
        this.region = region;
        this.accountID = creds.AccountID;
    }
    FcClient.prototype.makeService = function (prop) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceName, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serviceName = prop.serviceName;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        logger_1.default.debug(stdout_formatter_1.default.stdoutFormatter.create('service', serviceName));
                        return [4 /*yield*/, this.client.createService(serviceName, prop)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        ex_1 = _a.sent();
                        if (ex_1.code !== 'ServiceAlreadyExists') {
                            logger_1.default.debug("Creating service error, ex code: " + ex_1.code + ", ex: " + ex_1.message);
                            throw ex_1;
                        }
                        logger_1.default.debug(stdout_formatter_1.default.stdoutFormatter.update('service', serviceName));
                        return [4 /*yield*/, this.client.updateService(serviceName, prop)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FcClient.prototype.makeFunctionCode = function (serviceName, functionName, codeUri) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheDir, zipFilePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (codeUri.endsWith('.zip') || codeUri.endsWith('.jar') || codeUri.endsWith('.war')) {
                            return [2 /*return*/, codeUri];
                        }
                        cacheDir = path.join(os_1.default.homedir(), '.s', 'cache', 'fc-stress', 'code');
                        return [4 /*yield*/, fse.ensureDir(cacheDir)];
                    case 1:
                        _a.sent();
                        zipFilePath = path.join(cacheDir, this.accountID + "-" + this.region + "-" + serviceName + "-" + functionName + ".zip");
                        return [4 /*yield*/, zip_1.packTo(codeUri, null, zipFilePath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, zipFilePath];
                }
            });
        });
    };
    FcClient.prototype.makeFunction = function (prop) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceName, functionName, codeUri, zipFilePath, _a, _b, ex_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        serviceName = prop.serviceName, functionName = prop.functionName, codeUri = prop.codeUri;
                        return [4 /*yield*/, this.makeFunctionCode(serviceName, functionName, codeUri)];
                    case 1:
                        zipFilePath = _c.sent();
                        logger_1.default.debug("Zip code file path: " + zipFilePath);
                        _a = prop;
                        _b = {};
                        return [4 /*yield*/, fse.readFile(zipFilePath, 'base64')];
                    case 2:
                        _a.code = (_b.zipFile = _c.sent(),
                            _b);
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 8]);
                        logger_1.default.debug(stdout_formatter_1.default.stdoutFormatter.update('function', serviceName + "/" + functionName));
                        return [4 /*yield*/, this.client.updateFunction(serviceName, functionName, prop)];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 5:
                        ex_2 = _c.sent();
                        if (!(ex_2.code === 'FunctionNotFound')) return [3 /*break*/, 7];
                        prop.functionName = functionName;
                        logger_1.default.debug(stdout_formatter_1.default.stdoutFormatter.create('function', serviceName + "/" + functionName));
                        return [4 /*yield*/, this.client.createFunction(serviceName, prop)];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                    case 7:
                        logger_1.default.debug("Updating function error, ex code: " + ex_2.code + ", ex: " + ex_2.message);
                        throw ex_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    FcClient.prototype.removeFunction = function (serviceName, functionName) {
        return __awaiter(this, void 0, void 0, function () {
            var ex_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger_1.default.debug("Removing function " + serviceName + "/" + functionName + "...");
                        return [4 /*yield*/, this.client.deleteFunction(serviceName, functionName)];
                    case 1:
                        _a.sent();
                        logger_1.default.debug("Removing function " + serviceName + "/" + functionName + " success.");
                        return [3 /*break*/, 3];
                    case 2:
                        ex_3 = _a.sent();
                        logger_1.default.warning("Removing function failed.\nex code: " + ex_3.code + ", ex: " + ex_3.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FcClient.prototype.removeService = function (serviceName) {
        return __awaiter(this, void 0, void 0, function () {
            var ex_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger_1.default.debug("Removing service " + serviceName + "...");
                        return [4 /*yield*/, this.client.deleteService(serviceName)];
                    case 1:
                        _a.sent();
                        logger_1.default.debug("Removing service " + serviceName + " success.");
                        return [3 /*break*/, 3];
                    case 2:
                        ex_4 = _a.sent();
                        logger_1.default.warning("Removing service failed.\nex code: " + ex_4.code + ", ex: " + ex_4.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FcClient.prototype.invokeFunction = function (serviceName, functionName, event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.default.debug("Invoking service: " + serviceName + ", function: " + functionName);
                        return [4 /*yield*/, this.client.invokeFunction(serviceName, functionName, event)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FcClient.prototype.checkIfFunctionExist = function (serviceName, functionName) {
        return __awaiter(this, void 0, void 0, function () {
            var ex_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.getFunction(serviceName, functionName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        ex_5 = _a.sent();
                        if (ex_5.code === 'FunctionNotFound' || ex_5.code === 'ServiceNotFound') {
                            return [2 /*return*/, false];
                        }
                        throw ex_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FcClient.defaultTimeout = 600 * 1000;
    return FcClient;
}());
exports.FcClient = FcClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2ZjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxzREFBK0I7QUFDL0IsNERBQXNDO0FBQ3RDLHlDQUE2QjtBQUM3QiwwQ0FBb0I7QUFDcEIsNENBQWdDO0FBQ2hDLDZCQUErQjtBQUMvQixrRkFBMkQ7QUFFM0Q7SUFLRSxrQkFBWSxNQUFjLEVBQUUsS0FBbUIsRUFBRSxPQUFnQjtRQUMvRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksYUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDcEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLGVBQWUsRUFBRSxLQUFLLENBQUMsZUFBZTtZQUN0QyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDbEMsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUUsT0FBTyxJQUFJLFFBQVEsQ0FBQyxjQUFjO1NBQzVDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztJQUNuQyxDQUFDO0lBRUssOEJBQVcsR0FBakIsVUFBa0IsSUFBUzs7Ozs7O3dCQUNqQixXQUFXLEdBQUssSUFBSSxZQUFULENBQVU7Ozs7d0JBRTNCLGdCQUFNLENBQUMsS0FBSyxDQUFDLDBCQUFlLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDN0UscUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxFQUFBOzt3QkFBbEQsU0FBa0QsQ0FBQzs7Ozt3QkFFbkQsSUFBSSxJQUFFLENBQUMsSUFBSSxLQUFLLHNC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
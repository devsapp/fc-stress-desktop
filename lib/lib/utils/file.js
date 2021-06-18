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
exports.payloadPriority = exports.readLines = void 0;
var readline_1 = __importDefault(require("readline"));
var fse = __importStar(require("fs-extra"));
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
function readLines(fileName) {
    return new Promise(function (resolve, reject) {
        var lines = [];
        readline_1.default.createInterface({ input: fse.createReadStream(fileName) })
            .on('line', function (line) { return lines.push(line); })
            .on('close', function () { return resolve(lines); })
            .on('error', reject);
    });
}
exports.readLines = readLines;
function payloadPriority(event, eventFile) {
    return __awaiter(this, void 0, void 0, function () {
        var absEventFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (event && lodash_1.default.isString(event)) {
                        return [2 /*return*/, event];
                    }
                    if (!eventFile) {
                        return [2 /*return*/, null];
                    }
                    absEventFile = path_1.default.resolve(process.cwd(), eventFile);
                    return [4 /*yield*/, fse.pathExists(absEventFile)];
                case 1:
                    if (!(_a.sent()) || !fse.lstatSync(absEventFile).isFile) {
                        throw new Error("Event file: " + absEventFile + " not exist.");
                    }
                    return [4 /*yield*/, getEvent(eventFile)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.payloadPriority = payloadPriority;
function getEvent(eventFile) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var input = fse.createReadStream(eventFile, {
                            encoding: 'utf-8'
                        });
                        var rl = readline_1.default.createInterface({
                            input: input,
                            output: process.stdout
                        });
                        var event = '';
                        rl.on('line', function (line) {
                            event += line;
                        });
                        rl.on('close', function () {
                            console.log();
                            resolve(event);
                        });
                        rl.on('SIGINT', function () {
                            reject(new Error('^C'));
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbHMvZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQWdDO0FBQ2hDLDRDQUFnQztBQUNoQyxrREFBdUI7QUFDdkIsOENBQXdCO0FBRXhCLFNBQWdCLFNBQVMsQ0FBQyxRQUFnQjtJQUN4QyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFDakMsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWpCLGtCQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2FBQ2hFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFJLElBQUssT0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFoQixDQUFnQixDQUFDO2FBQ3RDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBZCxDQUFjLENBQUM7YUFDakMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFURCw4QkFTQztBQUVELFNBQXNCLGVBQWUsQ0FBQyxLQUFjLEVBQUUsU0FBa0I7Ozs7OztvQkFDdEUsSUFBSSxLQUFLLElBQUksZ0JBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQUUsc0JBQU8sS0FBSyxFQUFDO3FCQUFFO29CQUNqRCxJQUFJLENBQUMsU0FBUyxFQUFFO3dCQUFFLHNCQUFPLElBQUksRUFBQztxQkFBRTtvQkFFMUIsWUFBWSxHQUFXLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUMvRCxxQkFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUFBOztvQkFBdkMsSUFBSSxDQUFDLENBQUEsU0FBa0MsQ0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEVBQUU7d0JBQzlFLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWUsWUFBWSxnQkFBYSxDQUFDLENBQUM7cUJBQzNEO29CQUVNLHFCQUFNLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBQTt3QkFBaEMsc0JBQU8sU0FBeUIsRUFBQzs7OztDQUNsQztBQVZELDBDQVVDO0FBRUQsU0FBZSxRQUFRLENBQUMsU0FBUzs7Ozt3QkFDeEIscUJBQU0sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTt3QkFDdkMsSUFBTSxLQUFLLEdBQVEsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRTs0QkFDakQsUUFBUSxFQUFFLE9BQU87eUJBQ2xCLENBQUMsQ0FBQzt3QkFDSCxJQUFNLEVBQUUsR0FBRyxrQkFBUSxDQUFDLGVBQWUsQ0FBQzs0QkFDbEMsS0FBSyxPQUFBOzRCQUNMLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTt5QkFDdkIsQ0FBQyxDQUFDO3dCQUVILElBQUksS0FBSyxHQUFXLEVBQUUsQ0FBQzt3QkFDdkIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFJOzRCQUNqQixLQUFLLElBQUksSUFBSSxDQUFDO3dCQUNoQixDQUFDLENBQUMsQ0FBQzt3QkFDSCxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTs0QkFDYixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNqQixDQUFDLENBQUMsQ0FBQzt3QkFFSCxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTs0QkFFZCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLEVBQUE7d0JBdEJGLHNCQUFPLFNBc0JMLEVBQUE7Ozs7Q0FFSCJ9
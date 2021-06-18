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
exports.packTo = void 0;
var fse = __importStar(require("fs-extra"));
var logger_1 = __importDefault(require("../common/logger"));
var path = __importStar(require("path"));
var utils_1 = require("./utils/utils");
var colors_1 = require("colors");
var archiver_1 = __importDefault(require("archiver"));
var _ = __importStar(require("lodash"));
var file_1 = require("./utils/file");
var isWindows = process.platform === 'win32';
function packTo(file, codeignore, targetPath, prefix, zlibOptions) {
    if (prefix === void 0) { prefix = ''; }
    if (zlibOptions === void 0) { zlibOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var stats, bar, output, zipArchiver, count, asbFilePath, isBootstrap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fse.pathExists(file)];
                case 1:
                    if (!(_a.sent())) {
                        throw new Error("Zip source " + file + " is not exist.");
                    }
                    return [4 /*yield*/, fse.lstat(file)];
                case 2:
                    stats = _a.sent();
                    if (codeignore && codeignore(file)) {
                        throw new Error("File " + file + " is ignored.");
                    }
                    logger_1.default.debug("append " + (stats.isFile() ? 'file' : 'folder') + ": " + file + ", absolute path is " + path.resolve(file));
                    bar = utils_1.createProgressBar(colors_1.green(':zipping') + " :bar :current/:total :rate files/s, :percent :etas", { total: 0 });
                    output = fse.createWriteStream(targetPath);
                    zipArchiver = archiver_1.default('zip', {
                        zlib: _.merge({
                            level: 6,
                        }, zlibOptions),
                    }).on('progress', function (progress) {
                        bar.total = progress.entries.total;
                        bar.tick({
                            total: progress.entries.processed,
                        });
                    }).on('warning', function (err) {
                        console.warn(err);
                    }).on('error', function (err) {
                        console.error("    " + colors_1.green('x') + " " + targetPath + " - " + colors_1.grey('zip error'));
                        throw err;
                    });
                    // copied from https://github.com/archiverjs/node-archiver/blob/master/lib/core.js#L834-L877
                    // but add mode support
                    zipArchiver.symlink = function (filepath, target, _a) {
                        var mode = _a.mode;
                        var data = Object.assign({}, {
                            type: 'symlink',
                            name: filepath.replace(/\\/g, '/'),
                            linkname: target.replace(/\\/g, '/'),
                            sourceType: 'buffer',
                        });
                        if (mode) {
                            Object.assign(data, {
                                mode: mode,
                            });
                        }
                        this._entriesCount++;
                        this._queue.push({
                            data: data,
                            source: Buffer.alloc(0),
                        });
                        return this;
                    };
                    zipArchiver.pipe(output);
                    asbFilePath = path.resolve(file);
                    isBootstrap = isBootstrapPath(asbFilePath, asbFilePath, true);
                    if (!stats.isFile()) return [3 /*break*/, 3];
                    zipArchiver.file(asbFilePath, {
                        name: path.basename(file),
                        prefix: prefix,
                        mode: (isBootstrap || isWindows) ? stats.mode | 73 : stats.mode,
                    });
                    count = 1;
                    return [3 /*break*/, 6];
                case 3:
                    if (!stats.isDirectory()) return [3 /*break*/, 5];
                    return [4 /*yield*/, zipFolder(zipArchiver, file, [], codeignore, file, prefix)];
                case 4:
                    count = _a.sent();
                    return [3 /*break*/, 6];
                case 5: throw new Error("File " + file + " must be a regular file or directory.");
                case 6: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        output.on('close', function () {
                            var compressedSize = zipArchiver.pointer();
                            resolve({ count: count, compressedSize: compressedSize });
                        });
                        try {
                            zipArchiver.finalize();
                        }
                        catch (err) {
                            reject(err);
                        }
                    })];
                case 7: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.packTo = packTo;
function zipFolder(zipArchiver, folder, folders, codeignore, codeUri, prefix) {
    if (prefix === void 0) { prefix = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var absCodeUri, dir, dirItems, absDir, relativeFromCodeUri;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    folders.push(folder);
                    absCodeUri = path.resolve(codeUri);
                    dir = path.join.apply(path, folders);
                    return [4 /*yield*/, fse.readdir(dir)];
                case 1:
                    dirItems = _a.sent();
                    absDir = path.resolve(dir);
                    relativeFromCodeUri = path.relative(absCodeUri, absDir);
                    if (!_.isEmpty(relativeFromCodeUri)) {
                        zipArchiver.append(null, {
                            name: relativeFromCodeUri,
                            type: 'directory',
                            prefix: prefix,
                        });
                    }
                    return [4 /*yield*/, Promise.all(dirItems.map(function (f) { return __awaiter(_this, void 0, void 0, function () {
                            var fPath, s, error_1, absFilePath, relative, isBootstrap, content, target;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fPath = path.join(dir, f);
                                        logger_1.default.debug("before zip: lstat fPath: " + fPath + ", absolute fPath is " + path.resolve(fPath));
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, fse.lstat(fPath)];
                                    case 2:
                                        s = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        logger_1.default.debug("before zip: could not found fPath " + fPath + ", absolute fPath is " + path.resolve(fPath) + ", exception is " + error_1 + ", skiping");
                                        return [2 /*return*/, 0];
                                    case 4:
                                        if (codeignore && codeignore(fPath)) {
                                            logger_1.default.debug("file " + fPath + " is ignored.");
                                            return [2 /*return*/, 0];
                                        }
                                        absFilePath = path.resolve(fPath);
                                        relative = path.relative(absCodeUri, absFilePath);
                                        isBootstrap = isBootstrapPath(absFilePath, absCodeUri, false);
                                        if (!(s.size === 1067)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, file_1.readLines(fPath)];
                                    case 5:
                                        content = _a.sent();
                                        if (_.head(content) === 'XSym' && content.length === 5) {
                                            target = content[3];
                                            zipArchiver.symlink(relative, target, {
                                                mode: (isBootstrap || isWindows) ? s.mode | 73 : s.mode,
                                            });
                                            return [2 /*return*/, 1];
                                        }
                                        _a.label = 6;
                                    case 6:
                                        if (!(s.isFile() || s.isSymbolicLink())) return [3 /*break*/, 7];
                                        zipArchiver.file(fPath, {
                                            name: relative,
                                            prefix: prefix,
                                            mode: (isBootstrap || isWindows) ? s.mode | 73 : s.mode,
                                            stats: s,
                                        });
                                        return [2 /*return*/, 1];
                                    case 7:
                                        if (!s.isDirectory()) return [3 /*break*/, 9];
                                        return [4 /*yield*/, zipFolder(zipArchiver, f, folders.slice(), codeignore, codeUri, prefix)];
                                    case 8: return [2 /*return*/, _a.sent()];
                                    case 9:
                                        console.error("Ignore file " + absFilePath + ", because it isn't a file, symbolic link or directory");
                                        return [2 /*return*/, 0];
                                }
                            });
                        }); }))];
                case 2: return [2 /*return*/, (_a.sent()).reduce((function (sum, curr) { return sum + curr; }), 0)];
            }
        });
    });
}
function isBootstrapPath(absFilePath, absCodeUri, isFile) {
    if (isFile === void 0) { isFile = true; }
    var absBootstrapDir;
    if (isFile) {
        absBootstrapDir = path.dirname(absCodeUri);
    }
    else {
        absBootstrapDir = absCodeUri;
    }
    return path.join(absBootstrapDir, 'bootstrap') === absFilePath;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi96aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUFnQztBQUNoQyw0REFBc0M7QUFDdEMseUNBQTZCO0FBQzdCLHVDQUFrRDtBQUNsRCxpQ0FBcUM7QUFDckMsc0RBQWdDO0FBQ2hDLHdDQUE0QjtBQUM1QixxQ0FBeUM7QUFFekMsSUFBTSxTQUFTLEdBQVksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7QUFFeEQsU0FBc0IsTUFBTSxDQUFDLElBQVksRUFBRSxVQUFlLEVBQUUsVUFBa0IsRUFBRSxNQUFXLEVBQUUsV0FBZ0I7SUFBN0IsdUJBQUEsRUFBQSxXQUFXO0lBQUUsNEJBQUEsRUFBQSxnQkFBZ0I7Ozs7O3dCQUNyRyxxQkFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFBOztvQkFBaEMsSUFBSSxDQUFDLENBQUMsU0FBMEIsQ0FBQyxFQUFFO3dCQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFjLElBQUksbUJBQWdCLENBQUMsQ0FBQztxQkFDckQ7b0JBQ2EscUJBQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQTs7b0JBQTdCLEtBQUssR0FBRyxTQUFxQjtvQkFFbkMsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVEsSUFBSSxpQkFBYyxDQUFDLENBQUM7cUJBQzdDO29CQUVELGdCQUFNLENBQUMsS0FBSyxDQUFDLGFBQVUsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsV0FBSyxJQUFJLDJCQUFzQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FB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
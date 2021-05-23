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
define(["require", "exports", "jquery", "knockout", "electron", "./CueViewModel", "jquery-circle-progress"], function (require, exports, $, ko, electron_1, CueViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppViewModel = void 0;
    var fs = require('fs');
    var AppViewModel = /** @class */ (function () {
        function AppViewModel() {
            this.SoundCues = ko.observableArray([]);
            this.currentShow = new ShowFile(); // eventually load in?
            this.editCueVM = ko.observable(new CueViewModel_1.CueViewModel(""));
            this.loadedFilePath = null;
        }
        AppViewModel.prototype.stopAll = function () {
            this.SoundCues().forEach(function (scue) {
                scue.stop();
            });
        };
        AppViewModel.prototype.addCue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var openResult, filePaths;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog({
                                properties: ['openFile', 'multiSelections'],
                                filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
                            })];
                        case 1:
                            openResult = _a.sent();
                            filePaths = openResult.filePaths;
                            if (filePaths) {
                                filePaths.forEach(function (value, index) {
                                    _this.SoundCues.push(new CueViewModel_1.CueViewModel(filePaths[index], false));
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AppViewModel.prototype.addPlaylistCue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var openResult, filePaths;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog({
                                properties: ['openFile', 'multiSelections'],
                                filters: [{ name: 'Audio Files', extensions: ['mp3', 'm4a', 'wav', 'ogg'] }]
                            })];
                        case 1:
                            openResult = _a.sent();
                            filePaths = openResult.filePaths;
                            if (filePaths === null || filePaths === void 0 ? void 0 : filePaths.length) {
                                this.SoundCues.push(new CueViewModel_1.PlaylistCueViewModel(filePaths, false));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AppViewModel.prototype.save = function () {
            return __awaiter(this, void 0, void 0, function () {
                var saveResult, filePath;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("save");
                            this.currentShow.ShowName = "Test";
                            this.currentShow.Cues = [];
                            this.SoundCues().forEach(function (scue) {
                                var cue = new Cue();
                                scue.save(cue);
                                _this.currentShow.Cues.push(cue);
                            });
                            if (!!this.loadedFilePath) return [3 /*break*/, 2];
                            return [4 /*yield*/, electron_1.dialog.showSaveDialog({
                                    title: "Save Show",
                                    filters: [{ name: 'show File', extensions: ['sc'] }]
                                })];
                        case 1:
                            saveResult = _a.sent();
                            filePath = saveResult.filePath;
                            //this.currentShow = ko.toJSON(this.SoundCues);
                            fs.writeFile(filePath, JSON.stringify(this.currentShow));
                            console.log("saved");
                            return [3 /*break*/, 3];
                        case 2:
                            fs.writeFile(this.loadedFilePath, JSON.stringify(this.currentShow));
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AppViewModel.prototype.load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var openResult, filePaths, path, cvm;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("load");
                            return [4 /*yield*/, electron_1.dialog.showOpenDialog({
                                    title: "Save Show",
                                    filters: [{ name: 'show File', extensions: ['sc'] }]
                                })];
                        case 1:
                            openResult = _a.sent();
                            filePaths = openResult.filePaths;
                            if (filePaths) {
                                if (filePaths[0]) {
                                    path = filePaths[0];
                                    this.currentShow = JSON.parse(fs.readFileSync(path));
                                    this.SoundCues.removeAll();
                                    cvm = null;
                                    this.currentShow.Cues.forEach(function (cue) {
                                        if (typeof cue.fileName === 'string') {
                                            cvm = new CueViewModel_1.CueViewModel(cue.fileName, cue.loop, cue.volume, cue.fadeTime);
                                        }
                                        else if (typeof cue.fileName === 'object') {
                                            cvm = new CueViewModel_1.PlaylistCueViewModel(cue.fileName, cue.loop, cue.shuffle, cue.volume, cue.fadeTime);
                                        }
                                        //cvm.load(cue);
                                        _this.SoundCues.push(cvm);
                                    });
                                    this.loadedFilePath = path;
                                    console.log("loaded");
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AppViewModel.prototype.deleteCue = function (e) {
            //e.stop();
            if (confirm("Are you sure")) {
                this.SoundCues.remove(e);
                //e.removeDom();
            }
        };
        AppViewModel.prototype.editCue = function (e) {
            this.editCueVM(e);
            $("#editModal").modal('show');
        };
        return AppViewModel;
    }());
    exports.AppViewModel = AppViewModel;
});

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lib/Telegram.ts":
/*!*****************************!*\
  !*** ./src/lib/Telegram.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Telegram = void 0;
// data link layer data
class Telegram {
    constructor() {
        // public possibleStartFound: boolean = false;
        // public startFound: boolean = false;
        // public stopFound: boolean = false;
        this._dataLen = 0;
        this._totalLen = 0;
        this.checkSum = -1;
        this.controlField = 0;
        this.addressField = 0;
        this._controlInformationField = 0;
        this._sequenceNumber = 0;
        this._lastIsLastSegment = true; // or application data is only in one single telegram
        this.userData = [];
    }
    set dataLen(len) {
        this._dataLen = len;
        this._totalLen = len + 6; // 2x start, 2x len, checksum, stop
    }
    get dataLen() {
        return this._dataLen;
    }
    get totalLen() {
        return this._totalLen;
    }
    set controlInformationField(ciField) {
        this._controlInformationField = ciField;
        this._sequenceNumber = this._controlInformationField & 0b00001111;
        this._lastIsLastSegment = (this._controlInformationField & 0b00010000) == 0b00010000;
    }
    get controlInformationField() {
        return this._controlInformationField;
    }
    get sequenceNumber() {
        return this._sequenceNumber;
    }
    get lastIsLastSegment() {
        return this._lastIsLastSegment;
    }
}
exports.Telegram = Telegram;


/***/ }),

/***/ "./src/lib/enums.ts":
/*!**************************!*\
  !*** ./src/lib/enums.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramStatus = void 0;
var TelegramStatus;
(function (TelegramStatus) {
    TelegramStatus[TelegramStatus["pending"] = 0] = "pending";
    TelegramStatus[TelegramStatus["available"] = 1] = "available";
})(TelegramStatus = exports.TelegramStatus || (exports.TelegramStatus = {}));


/***/ }),

/***/ "./src/lib/telegram-reader.ts":
/*!************************************!*\
  !*** ./src/lib/telegram-reader.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramReader = void 0;
const enums_1 = __webpack_require__(/*! ./enums */ "./src/lib/enums.ts");
const Telegram_1 = __webpack_require__(/*! ./Telegram */ "./src/lib/Telegram.ts");
// data link layer
class TelegramReader {
    constructor() {
        this.currentTelegram = new Telegram_1.Telegram();
        this.possibleStartFound = false;
        this.data = [];
        this.telegrams = [];
    }
    areTelegramsAvailable() {
        return this.telegrams.length > 0 ? enums_1.TelegramStatus.available : enums_1.TelegramStatus.pending;
    }
    resetSearch() {
        this.possibleStartFound = false;
        this.currentTelegram = new Telegram_1.Telegram();
    }
    addRawData(newData) {
        //console.log('addRawData', JSON.stringify(newData));
        if (!this.possibleStartFound) {
            const startByteIndex = newData.indexOf(TelegramReader.startByte);
            if (startByteIndex < 0) {
                return this.areTelegramsAvailable();
            }
            this.possibleStartFound = true;
            if (startByteIndex > 0) {
                newData = newData.slice(startByteIndex);
            }
        }
        this.data.push(...newData);
        // console.log('addRawData this.data', JSON.stringify(this.data), this.data.length);
        return this.checkTelegram();
    }
    // only fetch them once!
    getTelegrams() {
        console.log('getTelegrams this.telegrams.length', this.telegrams.length);
        const ret = [...this.telegrams];
        console.log('getTelegrams ret.length 1', ret.length);
        this.telegrams = [];
        console.log('getTelegrams ret.length 2', ret.length);
        return ret;
    }
    checkTelegram() {
        if (this.data.length < 4) {
            return this.areTelegramsAvailable();
        }
        if (this.currentTelegram.dataLen <= 0) {
            // check for telegram start sequence
            if (this.data[3] != TelegramReader.startByte || this.data[1] != this.data[2]) {
                return this.checkForNewStartIndex(1);
            }
            this.currentTelegram.dataLen = this.data[1];
        }
        if (this.currentTelegram.dataLen <= 3) {
            // control frame -> ignore
            return this.checkForNewStartIndex(1);
        }
        // long frame
        if (this.data.length < this.currentTelegram.totalLen) {
            return this.areTelegramsAvailable();
        }
        if (this.data[this.currentTelegram.totalLen - 1] != TelegramReader.stopByte) {
            return this.checkForNewStartIndex(1);
        }
        const calculatedChecksum = this.checkChecksum();
        this.currentTelegram.checkSum = this.data[this.currentTelegram.totalLen - 2];
        if (calculatedChecksum != this.currentTelegram.checkSum) {
            console.warn('Invalid checksum', calculatedChecksum, this.currentTelegram.checkSum);
            return this.checkForNewStartIndex(1);
        }
        // seems like everything is fine - set telegram fields
        this.currentTelegram.controlField = this.data[4];
        this.currentTelegram.addressField = this.data[5];
        this.currentTelegram.controlInformationField = this.data[6];
        this.currentTelegram.userData = this.data.slice(6, this.currentTelegram.dataLen - 2);
        // reset for next telegram
        console.log('checkTelegram this.currentTelegram', this.currentTelegram);
        this.telegrams.push(this.currentTelegram);
        console.log('checkTelegram this.telegrams.length', this.telegrams.length);
        const len = this.currentTelegram.totalLen;
        this.resetSearch();
        if (this.data.length > len) {
            this.data = this.data.slice(len);
            // maybe we have another one:
            return this.checkTelegram();
        }
        this.data = [];
        //return this.areTelegramsAvailable()
        return enums_1.TelegramStatus.available;
    }
    checkForNewStartIndex(firstPossibleIndex) {
        this.resetSearch();
        const newStartByteIndex = this.data.indexOf(TelegramReader.startByte, firstPossibleIndex);
        if (newStartByteIndex < firstPossibleIndex) {
            this.data = [];
            return this.areTelegramsAvailable();
        }
        this.data = this.data.slice(newStartByteIndex);
        this.possibleStartFound = true;
        return this.checkTelegram();
    }
    checkChecksum() {
        const start = 4;
        const end = this.currentTelegram.totalLen - 2;
        let sum = 0;
        for (let i = start; i < end; i++) {
            sum += this.data[i];
        }
        return sum & 0xFF;
    }
}
exports.TelegramReader = TelegramReader;
TelegramReader.startByte = 0x68;
TelegramReader.stopByte = 0x16;


/***/ }),

/***/ "serialport":
/*!*****************************!*\
  !*** external "serialport" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("serialport");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*************************************!*\
  !*** ./src/smartmeter-mbus-dlms.ts ***!
  \*************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const serialport_1 = __webpack_require__(/*! serialport */ "serialport");
const telegram_reader_1 = __webpack_require__(/*! ./lib/telegram-reader */ "./src/lib/telegram-reader.ts");
const enums_1 = __webpack_require__(/*! ./lib/enums */ "./src/lib/enums.ts");
const settings = {
    // serial port settings
    //port: '/dev/ttyUSB0'
    port: '/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller_DIDSt114J20-if00-port0',
    baudRate: 2400,
    dataBits: 8,
    parity: 'none',
    stopBits: 1
};
function main() {
    const port = new serialport_1.SerialPort({
        path: settings.port,
        baudRate: settings.baudRate,
        dataBits: settings.dataBits,
        parity: settings.parity,
        stopBits: settings.stopBits
    });
    const telegramReader = new telegram_reader_1.TelegramReader();
    // Read data that is available but keep the stream in "paused mode"
    // port.on('readable', function () {
    // 	console.log('Data:', port.read())
    // })
    // Switches the port into "flowing mode"
    port.on('data', function (serialPortData) {
        //console.log('Data:', serialPortData)
        //console.log('real:', JSON.stringify(serialPortData));
        // let output = '';
        // for (let property in serialPortData) {
        // 	// @ts-ignore
        // 	output += property + ': ' + serialPortData[property] + '; ';
        // }
        // console.log(output);
        console.log([...serialPortData]);
        const result = telegramReader.addRawData([...serialPortData]);
        if (result == enums_1.TelegramStatus.available) {
            const telegrams = telegramReader.getTelegrams();
            console.log(JSON.stringify(telegrams));
        }
    });
    // port.on('open', function() {
    // 	// open logic
    // })
    port.on('error', function (err) {
        console.error('Error: ', err.message);
    });
}
main();
//Benchmark.bufferArrayBenchmark();

})();

var __webpack_export_target__ = this;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.js.map
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("itsm-rich-validators", [], factory);
	else if(typeof exports === 'object')
		exports["itsm-rich-validators"] = factory();
	else
		root["itsm-rich-validators"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _regexpConstant = __webpack_require__(2);

var _errorMessages = __webpack_require__(3);

function Validator(value, config) {
    var _this = this;

    this.value = value;
    this.config = config;
    this.rules = config.rules;
    this.regExps = _regexpConstant.REG_EXP;
    this.errorMessages = Object.assign({}, _errorMessages.ERROR_MESSAGES, config.errorMessages);

    var _createMessage = function _createMessage(message, settings) {
        for (var key in settings) {
            message = message.replace('%' + key + '%', settings[key]);
        }
        return message;
    };

    // var Validate = function (element, config) {
    //     if (!config.rules || Object.keys(config.rules).length === 0) {
    //         throw new Error('No rules for validation were passed to Validator function');
    //     }
    //     // Set regExps from outer scope
    //     this.regExps = regExps;
    // };

    /**
     *
     */
    this.validate = function () {
        var isValid = true;

        for (var rule in this.rules) {
            var testFn = this[rule];
            // Grab param value from config.rules
            var param = this.rules[rule];

            if (!testFn || typeof testFn !== 'function') {
                throw new Error('Rule ' + rule + ' can\'t be evaluated. It is not predefined. You can create custom rule with "addRule" method. validator.addRule("name", fn)');
            }

            if (!this[rule](param)) {
                isValid = false;
                this.message = _createMessage(this.errorMessages[rule], { rule: param, value: this.value });
                this.config.onError.call(this);
                break;
            }
        }

        if (isValid) {
            this.config.onSuccess.call(this);
        }
    };

    /**
     * Add custom validate function to validator instance
     * @param name
     * @param func
     */
    this.addRule = function (name, func) {
        this[name] = func;
    };

    // Here you can add methods for data validation
    this.required = function () {
        return _this.value.trim().length > 0;
    };
    this.min = function (val) {
        return _this.value.length >= val;
    };
    this.max = function (val) {
        return _this.value.length <= val;
    };
    this.match = function (regExpName) {
        var reg = _this.regExps[regExpName];
        if (!reg) {
            throw new Error('There are no such predefined regexp: ' + regExpName + '. All predefined regExps are: ' + Object.keys(_this.regExps).join(', '));
        }
        return reg.test(_this.value);
    };
}

var email = new Validator('r.u.', {
    rules: {
        required: true,
        min: 5,
        max: 20,
        match: 'EMAIL'
    },
    errorMessages: {
        min: 'Это поле должно содержать минимум %rule% символов. Значение %value% не подходит',
        max: 'Это поле должно содержать максимум %rule% символов. Значение %value% не подходит',
        match: 'Это поле должно содержать адрес электронной почты. Значение %value% не подходит'
    },
    onError: function onError() {
        console.log(this.message);
    },
    onSuccess: function onSuccess() {
        console.log('Ура! Всё прошло хорошо');
    }
});
var password = new Validator('qwewewewe', {
    rules: {
        required: true,
        password: true
    },
    errorMessages: {
        required: 'Это поле обязательно для заполнения!',
        password: 'Пароль должет быть qweqweqwe Значение "%value%" не подходит'
    },
    onError: function onError() {
        console.log(this.message);
    },
    onSuccess: function onSuccess() {
        console.log('Ура! Всё прошло хорошо');
    }
});

password.addRule('password', function () {
    return this.value.toLowerCase() === 'qweqweqwe';
});

var validators = [email, password];

validators.forEach(function (validator) {
    validator.validate();
});

module.export = Validator;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var CONSTANTS = {
    IP_V4: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PHONE: /^[0-9+\-()._\[\]{}\\\/ ]+$/,
    SITE: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
    LATIN_AND_DIGITS_SPECIAL_SYMBOLS: /^[\w\d\s*#+!@$%^&()\-=]+$/,
    NUMBER: /^[0-9]*$/,
    IPV6: /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*/,
    IPV6CIDR: /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/(d|dd|1[0-1]d|12[0-8]))$/,
    IPV4: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
    IPV4CIDR: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/,
    RFC_952: /^(https?:\/\/)?(([a-z][a-z0-9\-]*(\.[a-z][a-z0-9\-]*)*|[1,2]*\d*\d+)|((\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5]))(:(\d{1,4}|[0-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?\/?$/i,
    EMPTY_STRING: /^$/,
    UNIX_PATH: /^(\/[^/ ]*)+\/?$/,
    HOST: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/
};

var REG_EXP = exports.REG_EXP = CONSTANTS;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var CONSTANTS = {
    required: 'This field is required',
    email: 'Email field is required',
    min: 'This field should contain at least %rule% characters',
    max: 'This field should not contain more than %rule% characters',
    match: 'This field should contain a valid %rule%'
};

var ERROR_MESSAGES = exports.ERROR_MESSAGES = CONSTANTS;

/***/ })
/******/ ]);
});
//# sourceMappingURL=itsm-rich-validators.js.map
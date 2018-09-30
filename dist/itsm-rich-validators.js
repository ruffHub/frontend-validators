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

/* WEBPACK VAR INJECTION */(function(module) {function Validator(value, options) {
    // Default messages: All object created with Validate function will share link to this object
    var errorMessages = {
        required: 'This field is required',
        min: 'This field should contain at least %rule% characters',
        max: 'This field should not contain more than %rule% characters',
        password: 'asdasdasdasd',
        match: 'This field shold countain a valid %rule%'
    };
    const regExps = {
        email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
        url: /^((https?):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        numbers: /^\d+(\.\d{1,2})?$/,
        digits: /[0-9]*$/,
        letters: /[a-z][A-Z]*$/
    };
    // Extends one object from others
    // http://youmightnotneedjquery.com/#deep_extend
    var _extend = function (out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj) continue;

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') out[key] = _extend(out[key], obj[key]);else out[key] = obj[key];
                }
            }
        }

        return out;
    };
    var defaults = {
        regExps: regExps,
        errorMessages: errorMessages
    };

    // Set basic options to get access from onSuccess and onError functions
    this.options = _extend({}, defaults, options);

    this.value = value;
    this.options = options;
    this.rules = options.rules;
    this.errorMessages = options.errorMessages;

    this.required = function () {
        return this.value.trim().length > 0;
    };
    this.min = function (param) {
        return this.value.length >= param;
    };
    this.max = function (param) {
        return this.value.length <= param;
    };
    this.match = function (param) {
        var re = regExps[param];
        if (!re) {
            throw new Error('There are no such predefined regexp: ' + param + '. All predefined regExps are: ' + Object.keys(this.options.regExps).join(', '));
        }
        return regExps[param].test(this.value);
    };

    // Creates errorMessages by replacement %var% templates
    var _createMessage = function (message, settings) {
        for (var key in settings) {
            message = message.replace('%' + key + '%', settings[key]);
        }
        return message;
    };

    var Validate = function (element, options) {
        if (!options.rules || Object.keys(options.rules).length === 0) {
            throw new Error('No rules for validation were passed to Validator function');
        }
        // Set regExps from outer scope
        this.regExps = regExps;
    };

    this.validate = function () {
        let isValid = true;

        for (var rule in this.rules) {
            // Set testing function
            var test = this[rule];

            if (!test || typeof test !== 'function') {
                throw new Error('Rule ' + rule + ' can\'t be evaluated. It is not predefined. You can create it yourself with Validator.fn');
            }

            // Grab param from options object
            var param = this.rules[rule];

            if (!this[rule](param)) {
                isValid = false;
                this.message = _createMessage(this.errorMessages[rule], { rule: param, data: this.value });
                this.options.onError.call(this);
                break;
            }
        }

        if (isValid) {
            this.options.onSuccess.call(this);
        }
    };

    this.addRule = function (name, func) {
        this[name] = func;
    };
}

const REG_EXP = {
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
const onError = function () {
    console.log('Ошибка: ' + this.message);
};
const onSuccess = function () {
    console.log('Ура! Всё прошло хорошо');
};

let email = new Validator('r.u.f.f@mail.ru', {
    rules: {
        min: 5,
        max: 20,
        match: 'email'
    },
    errorMessages: {
        min: 'Это поле должно содержать минимум %rule% символов. Значение %value% не подходит',
        max: 'Это поле должно содержать максимум %rule% символов. Значение %value% не подходит',
        match: 'Это поле должно содержать адрес электронной почты. Значение %value% не подходит'
    },
    onError: onError,
    onSuccess: onSuccess
});
let password = new Validator('123123123123', {
    rules: {
        required: true,
        password: true
    },
    errorMessages: {
        required: 'Это поле обязательно для заполнения!',
        password: 'Пароль должет быть 12345qwerty Значение "%value%" не подходит'
    },
    onError: onError,
    onSuccess: onSuccess
});

password.addRule('password', function () {
    return this.value.toLowerCase() === '12345qwerty';
});

email.validate();
password.validate();

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


/***/ })
/******/ ]);
});
//# sourceMappingURL=itsm-rich-validators.js.map
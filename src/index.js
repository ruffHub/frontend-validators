function Validator(value, options) {
    // Default messages: All object created with Validate function will share link to this object
    var errorMessages = {
        required: 'This field is required',
        email: 'Email field is required',
        min: 'This field should contain at least %rule% characters',
        max: 'This field should not contain more than %rule% characters',
        match: 'This field should countain a valid %rule%'
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
    let defaults = {
        regExps: regExps,
        errorMessages: errorMessages
    };

    // Set basic options to get access from onSuccess and onError functions

    this.value = value;
    this.options = options;
    this.rules = options.rules;
    this.errorMessages = Object.assign({}, defaults.errorMessages, options.errorMessages);

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
            throw new Error('There are no such predefined regexp: '
                + param + '. All predefined regExps are: '
                + Object.keys(this.options.regExps).join(', '));
        }
        return regExps[param].test(this.value);
    };

    // Creates errorMessages by replacement %var% templates
    const _createMessage = (message, settings) => {
        for (let key in settings) {
            message = message.replace('%' + key + '%', settings[key]);
        }
        return message;
    };

    // var Validate = function (element, options) {
    //     if (!options.rules || Object.keys(options.rules).length === 0) {
    //         throw new Error('No rules for validation were passed to Validator function');
    //     }
    //     // Set regExps from outer scope
    //     this.regExps = regExps;
    // };

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
                this.message = _createMessage(this.errorMessages[rule], {rule: param, value: this.value});
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
    HOST: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,
};
const onError = function () {
    console.log('Ошибка: ' + this.message);
};
const onSuccess = function () {
    console.log('Ура! Всё прошло хорошо');
};

let email = new Validator('', {
    rules: {
        required: true,
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

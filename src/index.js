import {REG_EXP} from 'regexp.constant.js';
import {ERROR_MESSAGES} from 'error-messages.js';

function Validator(value, config) {
    this.value = value;
    this.config = config;
    this.rules = config.rules;
    this.regExps = REG_EXP;
    this.errorMessages = Object.assign({}, ERROR_MESSAGES, config.errorMessages);

    // Creates errorMessages by replacement %var% templates
    const _createMessage = (message, settings) => {
        for (let key in settings) {
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

    this.validate = function () {
        let isValid = true;

        for (let rule in this.rules) {
            const testFn = this[rule];
            // Grab param value from config.rules
            const param = this.rules[rule];

            if (!testFn || typeof testFn !== 'function') {
                throw new Error('Rule ' + rule + ' can\'t be evaluated. It is not predefined. You can create custom rule with "addRule" method. validator.addRule("name", fn)');
            }

            if (!this[rule](param)) {
                isValid = false;
                this.message = _createMessage(this.errorMessages[rule], {rule: param, value: this.value});
                this.config.onError.call(this);
                break;
            }
        }

        if (isValid) {
            this.config.onSuccess.call(this);
        }
    };

    this.addRule = function (name, func) {
        this[name] = func;
    };

    this.required = () => this.value.trim().length > 0;
    this.min = (val) => this.value.length >= val;
    this.max = (val) => this.value.length <= val;
    this.match = (regExpName) => {
        const reg = this.regExps[regExpName];
        if (!reg) {
            throw new Error(`There are no such predefined regexp: ${regExpName}. All predefined regExps are: ${Object.keys(this.regExps).join(', ')}`);
        }
        return reg.test(this.value);
    };
}

const onError = function () {
    console.log(this.message);
};
const onSuccess = function () {
    console.log('Ура! Всё прошло хорошо');
};

let email = new Validator('r.u.', {
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

let validators = [email, password];

validators.forEach(validator => {
    validator.validate();
});

module.export = Validator;

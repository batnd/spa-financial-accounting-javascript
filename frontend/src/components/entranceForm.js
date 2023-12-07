import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class EntranceForm {
    constructor(page) {
        this.processButton = null;
        this.rememberMeElement = null;
        this.passwordField = null;
        this.passwordRepeatField = null;
        this.passwordFieldValue = null;
        this.passwordRepeatFieldValue = null;

        this.allInputs = document.querySelectorAll('.sign-input');
        this.lastInput = this.allInputs[this.allInputs.length - 1];

        this.page = page;

        // --------------------------------------------------------------
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/main';
            return;
        }
        // --------------------------------------------------------------

        this.fieldsDefinition();
        this.actionsDefinition();

        this.fieldsEventsDefinition();
    }

    actionsDefinition() {
        const that = this;
        this.processButton = document.getElementById('processButton');
        this.processButton.addEventListener('click', () => {
            this.processForm();
        });
    }

    fieldsDefinition() {
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ];
        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                regex: /[А-Я][а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]+/,
                valid: false,
            });
            this.fields.push({
                name: 'passwordRepeat',
                id: 'passwordRepeat',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            });
        }
    }

    fieldsEventsDefinition() {
        const that = this;
        this.fields.forEach(field => {
            field.element = document.getElementById(field.id);
            if (field.name === 'password') {
                this.passwordField = field;

                field.element.onchange = function () {
                    that.passwordFieldValue = field.element.value;

                    that.validateField.call(that, field, this);

                    if (that.page === 'signup') {
                        that.validateRepeatPasswordField();
                    }
                }
                return;
            }
            if (field.name === 'passwordRepeat') {
                this.passwordRepeatField = field;

                field.element.onchange = function () {
                    that.passwordRepeatFieldValue = field.element.value;

                    that.validateRepeatPasswordField();
                }
                return;
            }
            field.element.onchange = function () {
                that.validateField.call(that, field, this);
            }
        });

        if (this.page === 'login') {
            this.rememberMeElement = document.getElementById('rememberMe');
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            this.fieldElementInvalid(field, element);
        } else {
            this.fieldElementIsValid(field, element);
        }
        this.validateForm();
    }

    validateRepeatPasswordField() {
        if (this.passwordRepeatFieldValue !== this.passwordFieldValue || this.passwordField.valid === false) {
            this.fieldElementInvalid(this.passwordRepeatField, this.passwordRepeatField.element);
        } else {
            this.fieldElementIsValid(this.passwordRepeatField, this.passwordRepeatField.element);
        }
        this.validateForm();
    }

    fieldElementInvalid(field, element) {
        element.classList.remove('border-secondary-subtle');
        element.classList.add('border-danger');
        element.classList.add('border-2');
        field.valid = false;
    }

    fieldElementIsValid(field, element) {
        element.classList.add('border-secondary-subtle');
        element.classList.remove('border-danger');
        element.classList.remove('border-2');
        field.valid = true;
    }

    validateForm() {
        const validForm = this.fields.every(field => field.valid);
        const isValid = validForm;
        if (isValid) {
            this.processButton.classList.remove('disabled');
        } else {
            this.processButton.classList.add('disabled');
        }
        return isValid;
    }

    async processForm() {
        if (this.validateForm()) {
            // login
            const emailValue = this.fields.find(field => field.name === 'email').element.value;
            const passwordValue = this.fields.find(field => field.name === 'password').element.value;
            const rememberMeValue = this.rememberMeElement ? this.rememberMeElement.checked : false;

            this.validUser();

            if (this.page === 'signup') {
                // add for signup
                const fullNameValue = this.fields.find(field => field.name === 'fullName').element.value;
                const firstName = fullNameValue.split(' ')[1];
                const lastName = fullNameValue.split(' ')[0];
                const passwordRepeatValue = this.fields.find(field => field.name === 'passwordRepeat').element.value;
                try {
                    const result = await CustomHttp.httpRequest(config.host + '/signup', 'POST', {
                        name: firstName,
                        lastName: lastName,
                        email: emailValue,
                        password: passwordValue,
                        passwordRepeat: passwordRepeatValue
                    });
                    if (result && result !== 400) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                        this.processCompleted();
                        this.processButton.classList.add('disabled');
                    }
                    if (result === 400) {
                        this.invalidUser();
                        return;
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            try {
                const result = await CustomHttp.httpRequest(config.host + '/login', 'POST', {
                    email: emailValue,
                    password: passwordValue,
                    rememberMe: rememberMeValue
                });
                if (result && result !== 400 && result !== 401) {
                    if (result.error ||
                        !result.tokens.accessToken ||
                        !result.tokens.refreshToken ||
                        !result.user.name ||
                        !result.user.lastName ||
                        !result.user.id) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo(result.user);

                    if (this.page === 'login') {
                        this.processCompleted();
                        this.processButton.classList.add('disabled');
                    }

                    if (this.page === 'signup') {
                        setTimeout(() => {
                            this.processCompletedClear();
                            location.href = '#/main';
                        }, 3000);
                        return;
                    }
                    if (this.page === 'login') {
                        setTimeout(() => {
                            this.processCompletedClear();
                            location.href = '#/main';
                        }, 3000);
                        return;
                    }
                }
                if (result === 401 || result === 400) {
                    if (this.page === 'login') {
                        this.invalidUser();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    invalidUser() {
        const invalidUser = document.createElement('div');
        invalidUser.className = 'form-invalidUser text-danger d-block text-start w-100';
        invalidUser.setAttribute('id', 'invalidUser');

        if (this.page === 'login') {
            invalidUser.innerText = 'Указаны неверные данные пользователя!';
        }
        if (this.page === 'signup') {
            invalidUser.innerText = 'Пользователь с таким email уже существует!';
        }

        this.lastInput.after(invalidUser);
    }

    validUser() {
        const invalidUserElement = document.getElementById('invalidUser');
        if (invalidUserElement) {
            document.getElementById('invalidUser').remove();
        }
    }

    processCompleted() {
        const processCompleted = document.createElement('div');
        processCompleted.className = 'form-invalidUser text-success d-block text-start w-100';
        processCompleted.setAttribute('id', 'processCompleted');

        if (this.page === 'signup') {
            processCompleted.innerText = 'Ваш аккаунт успешно зарегистрирован!';
        }
        if (this.page === 'login') {
            processCompleted.innerText = 'Вы успешно вошли в свой аккаунт!';
        }

        this.lastInput.after(processCompleted);
    }

    processCompletedClear() {
        const signupCompleted = document.getElementById('processCompleted');
        signupCompleted.remove();
    }
}
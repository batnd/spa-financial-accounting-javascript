import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../utils/balance.js";
import {UserName} from "../utils/userName.js";
import {UrlManager} from "../utils/url-manager.js";

export class OperationActions {
    constructor(route, category) {
        this.currentRoute = route;
        this.currentCategory = category;

        this.operationTitleElement = document.getElementById('operationTitle');
        this.operationTypeInputSelectorElement = document.getElementById('operationType');
        this.operationTypeSelectIncome = document.getElementById('selectIncome');
        this.operationTypeSelectExpense = document.getElementById('selectExpense');
        this.operationCategoryInputElement = document.getElementById('operationCategory');
        this.operationAmountInputElement = document.getElementById('operationAmount');
        this.operationDateInputElement = document.getElementById('operationDate');
        this.operationCommentElement = document.getElementById('operationComment');
        this.createButton = document.querySelector('.btn-create');
        this.cancelButton = document.querySelector('.btn-cancel');
        this.cancelButton.addEventListener('click', () => location.href = '#/operations');

        const queryParams = UrlManager.getQueryParams();
        this.currentId = queryParams.id;
        this.saveButton = document.querySelector('.btn-save');

        this.prepareCreateEditForm(this.currentCategory);
        this.createEditOperation(this.currentCategory, this.currentId);

        this.dataInit();
    }

    async dataInit() {
        await Balance.showBalance();
        await UserName.setUserName();
        if (this.currentCategory === 'create') {
            await this.showCurrentCategory();
        }
        if (this.currentCategory === 'edit') {
            await this.fillCurrentOperation();
        }
    }

    prepareCreateEditForm(category) {
        if (category === 'create') {
            if (this.currentRoute === 'income') {
                this.operationTypeSelectIncome.setAttribute('selected', 'selected');
                this.operationTitleElement.innerText = 'Создание дохода';
            }
            if (this.currentRoute === 'expense') {
                this.operationTypeSelectExpense.setAttribute('selected', 'selected');
                this.operationTitleElement.innerText = 'Создание расхода';
            }
        }
        if (category === 'edit') {
            this.operationTypeInputSelectorElement.removeAttribute('disabled');
            this.operationTypeInputSelectorElement.classList.remove('disabledSelect');
        }
    }

    createEditOperation(category, id) {
        // create
        let button = this.createButton;
        let url = '/operations';
        let method = 'POST';
        // edit
        if (category === 'edit') {
            button = this.saveButton;
            url = '/operations/' + id;
            method = 'PUT';
        }
        button.addEventListener('click', async () => {
            const operationTypeInputValue = this.operationTypeInputSelectorElement.value;
            const operationCategoryInputValue = parseInt(this.operationCategoryInputElement.value);
            const operationAmountInputValue = parseInt(this.operationAmountInputElement.value.trim());
            const operationDateInputValue = this.operationDateInputElement.value;
            const operationCommentValue = this.operationCommentElement.value;

            const areFieldsValid = this.validateAllFields();
            if (areFieldsValid) {
                try {
                    const result = await CustomHttp.httpRequest(config.host + url, method, {
                        type: operationTypeInputValue,
                        category_id: operationCategoryInputValue,
                        amount: operationAmountInputValue,
                        date: operationDateInputValue,
                        comment: operationCommentValue
                    });
                    if (result) {
                        location.href = '#/operations';
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    async showCurrentCategory() {
        try {
            const result = await CustomHttp.httpRequest(config.host + '/categories/' + this.operationTypeInputSelectorElement.value);
            if (result) {
                this.addCategories(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    addCategories(array) {
        if (array && array.length > 0) {
            array.forEach(category => {
                const option = document.createElement('option');
                option.setAttribute('value', category.id);
                option.classList.add('operationCategoryOption');
                option.innerText = category.title;
                this.operationCategoryInputElement.appendChild(option);
            });
        }
    }

    async fillCurrentOperation() {
        try {
            const currentOperation = await CustomHttp.httpRequest(config.host + '/operations/' + this.currentId);
            if (currentOperation) {
                await this.setCurrentOperationType(currentOperation);
                await this.requestCategoriesSelectorEvent();
                await this.showCurrentCategory();
                await this.fillEditForm(currentOperation);
            }
        } catch (error) {
            console.log(error);
        }
    }

    setCurrentOperationType(operation) {
        if (operation.type === 'income') this.operationTypeSelectIncome.setAttribute('selected', 'selected');
        if (operation.type === 'expense') this.operationTypeSelectExpense.setAttribute('selected', 'selected');
    }

    requestCategoriesSelectorEvent() {
        const that = this;
        this.operationTypeInputSelectorElement.addEventListener('change', async () => {
            that.defaultCategories();
            if (this.operationTypeInputSelectorElement.value) {
                try {
                    const result = await CustomHttp.httpRequest(config.host + '/categories/' + this.operationTypeInputSelectorElement.value)
                    if (result) {
                        that.addCategories(result);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    fillEditForm(operation) {
        // category
        const operationCategories = document.querySelectorAll('.operationCategoryOption');
        let currentOperationCategory = null;
        for (const category of operationCategories) {
            if (category.innerText === operation.category) {
                currentOperationCategory = category;
                break;
            }
        }
        if (currentOperationCategory) {
            currentOperationCategory.setAttribute('selected', 'selected');
        }
        // amount
        this.operationAmountInputElement.value = operation.amount;
        // date
        this.operationDateInputElement.value = operation.date;
        // comment
        this.operationCommentElement.value = operation.comment;
    }

    validateAllFields() {
        this.clearInvalidFieldsStyle();
        const isValidType = this.validateField(this.operationTypeInputSelectorElement);
        const isValidCategory = this.validateField(this.operationCategoryInputElement);
        const isValidAmount = this.validateAmount(this.operationAmountInputElement);
        const isValidDate = this.validateDate(this.operationDateInputElement);
        const isValidComment = this.validateField(this.operationCommentElement);

        const areFieldsValid = isValidType && isValidCategory && isValidAmount && isValidDate && isValidComment;
        return areFieldsValid;
    }

    clearInvalidFieldsStyle() {
        this.operationTypeInputSelectorElement.classList.remove('border-danger');
        this.operationCategoryInputElement.classList.remove('border-danger');
        this.operationAmountInputElement.classList.remove('border-danger');
        this.operationDateInputElement.classList.remove('border-danger');
        this.operationCommentElement.classList.remove('border-danger');
    }

    validateField(field) {
        if (field.value) {
            return true;
        } else {
            field.classList.add('border-danger');
            return false;
        }
    }

    validateAmount(field) {
        if (field.value && field.value > 0) {
            return true;
        } else {
            field.classList.add('border-danger');
            return false;
        }
    }

    validateDate(field) {
        const regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        if (field.value) {
            if (regex.test(field.value)) {
                return true;
            } else {
                field.classList.add('border-danger');
                return false;
            }
        } else {
            field.classList.add('border-danger');
            return false;
        }
    }

    defaultCategories() {
        this.operationCategoryInputElement.innerHTML = '';
        const option = document.createElement('option');
        option.setAttribute('value', '');
        option.innerText = 'Категория...';
        this.operationCategoryInputElement.appendChild(option);
    }
}
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../utils/balance.js";
import {UserName} from "../utils/userName.js";

export class CategoriesCreate {
    constructor(route) {
        this.currentRoute = route;

        this.createNewIncomeExpenseInputElement = document.querySelector('.category-actions-input');
        this.createNewIncomeExpenseLabelElement = document.getElementById('inputLabel');
        this.cancelButton = document.querySelector('.btn-cancel');
        this.createButton = document.querySelector('.btn-create');

        this.cancelButton.addEventListener('click', () => {
            location.href = '#/' + this.currentRoute;
        });
        this.createButton.addEventListener('click', () => {
            this.createNewIncomeExpense(this.currentRoute);
        });

        this.dataInit();
    }

    async dataInit() {
        await Balance.showBalance();
        await UserName.setUserName();
    }

    async createNewIncomeExpense(route) {
        const currentRoute = route;
        const inputValue = this.createNewIncomeExpenseInputElement.value.trim();
        this.createNewIncomeExpenseInputElement.classList.remove('border-danger');

        this.invalidIncomeExpenseNameRemove();

        if (inputValue) {
            try {
                const result = await CustomHttp.httpRequest(config.host + '/categories/' + currentRoute, 'POST', {
                    title: inputValue
                });
                if (result && result !== 400) location.href = '#/' + currentRoute;
                if (result === 400) {
                    this.createNewIncomeExpenseInputElement.classList.add('border-danger');
                    this.invalidIncomeExpenseName();
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            this.createNewIncomeExpenseInputElement.classList.add('border-danger');
        }
    }

    invalidIncomeExpenseNameRemove() {
        const invalidIncomeExpenseNameElement = document.getElementById('invalidIncomeName');
        if (invalidIncomeExpenseNameElement) invalidIncomeExpenseNameElement.remove();
    }

    invalidIncomeExpenseName() {
        const invalidIncomeExpenseNameElement = document.createElement('div');
        invalidIncomeExpenseNameElement.className = 'form-invalidUser text-danger d-block text-start w-100';
        invalidIncomeExpenseNameElement.setAttribute('id', 'invalidIncomeName');
        invalidIncomeExpenseNameElement.innerText = 'Такая категория уже есть!';
        this.createNewIncomeExpenseLabelElement.after(invalidIncomeExpenseNameElement);
    }
}
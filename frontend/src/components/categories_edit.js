import {UrlManager} from "../utils/url-manager.js";
import {Balance} from "../utils/balance.js";
import {UserName} from "../utils/userName.js";
import {IncomeExpenseProcess} from "../utils/income-expense-process.js";

export class CategoriesEdit {
    constructor(route) {
        this.currentRoute = route;

        this.editIncomeExpenseInputElement = document.querySelector('.category-actions-input');
        this.editIncomeExpenseLabelElement = document.getElementById('inputLabel');
        this.cancelButton = document.querySelector('.btn-cancel');
        this.saveButton = document.querySelector('.btn-save');

        this.cancelButton.addEventListener('click', () => {
            location.href = '#/' + this.currentRoute;
        });

        this.currentQueryId = UrlManager.getQueryParams().id;

        this.dataInit();
    }

    async dataInit() {
        await Balance.showBalance();
        await UserName.setUserName();

        this.allCurrentTypeCategories = await IncomeExpenseProcess.getCategoriesIncomeExpense(this.currentRoute);
        const requestCurrentCategoryName = await IncomeExpenseProcess.getIncomeExpense(this.currentRoute, this.currentQueryId);
        this.editIncomeExpenseInputElement.value = await requestCurrentCategoryName;

        await this.editCategory();
    }

    async editCategory() {
        const requestedInputCategoryName = this.editIncomeExpenseInputElement.value;
        this.saveButton.addEventListener('click', async () => {
            const newInputValue = this.editIncomeExpenseInputElement.value.trim();
            this.editIncomeExpenseInputElement.classList.remove('border-danger');

            this.invalidIncomeExpenseEditedNameRemove();
            if (!newInputValue) {
                this.editIncomeExpenseInputElement.classList.add('border-danger');
                return;
            }
            if (requestedInputCategoryName === newInputValue) {
                this.editIncomeExpenseInputElement.classList.add('border-danger');
                this.invalidIncomeExpenseEditedName('same');
                return;
            }
            const isNameAlreadyExists = this.allCurrentTypeCategories.find(category => category.title === newInputValue);
            if (isNameAlreadyExists) {
                this.editIncomeExpenseInputElement.classList.add('border-danger');
                this.invalidIncomeExpenseEditedName('exists');
                return;
            }
            this.invalidIncomeExpenseEditedNameRemove();
            IncomeExpenseProcess.editIncomeExpense(this.currentRoute, this.currentQueryId, newInputValue);
        });
    }

    invalidIncomeExpenseEditedNameRemove() {
        const invalidIncomeExpenseEditedNameElement = document.getElementById('invalidIncomeName');
        if (invalidIncomeExpenseEditedNameElement) {
            invalidIncomeExpenseEditedNameElement.remove();
        }
    }

    invalidIncomeExpenseEditedName(check) {
        const invalidIncomeExpenseEditedNameElement = document.createElement('div');
        invalidIncomeExpenseEditedNameElement.className = 'form-invalidUser text-danger d-block text-start w-100';
        invalidIncomeExpenseEditedNameElement.setAttribute('id', 'invalidIncomeName');
        if (check === 'same') invalidIncomeExpenseEditedNameElement.innerText = 'Вы указали тоже самое имя категории!';
        if (check === 'exists') invalidIncomeExpenseEditedNameElement.innerText = 'Категория с таким именем уже существует!';
        this.editIncomeExpenseLabelElement.after(invalidIncomeExpenseEditedNameElement);
    }
}
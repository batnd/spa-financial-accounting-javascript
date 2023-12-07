import {IncomeExpenseProcess} from "../utils/income-expense-process.js";
import {Balance} from "../utils/balance.js";
import {UserName} from "../utils/userName.js";

export class CategoriesMain {
    constructor(route) {
        this.currentRoute = route;
        this.incomeRoute = 'income';
        this.expenseRoute = 'expense';

        this.dataInit();

        this.createIncomeExpense(this.currentRoute);
    }

    async dataInit() {
        await Balance.showBalance();
        await UserName.setUserName();

        const getIncomeExpense = await IncomeExpenseProcess.getCategoriesIncomeExpense(this.currentRoute);
        await IncomeExpenseProcess.createIncomeExpense(getIncomeExpense);

        await this.deleteIncomeExpense(this.currentRoute);
        await this.editIncomeExpense(this.currentRoute);
    }

    createIncomeExpense(route) {
        this.createNewIncomeExpenseElement = document.querySelector('.category-item-createNew');
        this.createNewIncomeExpenseElement.addEventListener('click', () => {
            if (route === this.incomeRoute) location.href = '#/income/new';
            if (route === this.expenseRoute) location.href = '#/expense/new';
        });
    }

    deleteIncomeExpense(route) {
        this.deleteIncomeExpenseButtonElements = document.querySelectorAll('.btn-delete');
        this.deleteIncomeExpenseButtonElements.forEach(button => {
            button.addEventListener('click', () => {
                const incomeId = button.parentElement.parentElement.parentElement.getAttribute('id');
                const categoryName = button.parentElement.previousElementSibling.innerText;
                if (route === this.incomeRoute) {
                    IncomeExpenseProcess.deleteIncomeExpense('income', incomeId, categoryName);
                }
                if (route === this.expenseRoute) {
                    IncomeExpenseProcess.deleteIncomeExpense('expense', incomeId, categoryName);
                }
            });
        });
    }

    editIncomeExpense(route) {
        this.editIncomeExpenseButtonElements = document.querySelectorAll('.btn-edit');
        this.editIncomeExpenseButtonElements.forEach(button => {
            button.addEventListener('click', () => {
                const incomeId = button.parentElement.parentElement.parentElement.getAttribute('id');
                if (route === this.incomeRoute) location.href = '#/income/edit' + '?id=' + incomeId;
                if (route === this.expenseRoute) location.href = '#/expense/edit' + '?id=' + incomeId;
            });
        });
    }
}
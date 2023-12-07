import {EntranceForm} from "./components/entranceForm.js";
import {Main} from "./components/main.js";
import {Auth} from "./services/auth.js";
import {Income} from "./components/income.js";
import {Balance} from "./utils/balance.js";
import {Login} from "./components/login.js";
import {IncomeCreate} from "./components/income_create.js";
import {IncomeEdit} from "./components/income_edit.js";
import {Expense} from "./components/expense.js";
import {ExpenseCreate} from "./components/expense_create.js";
import {ExpenseEdit} from "./components/expense_edit.js";
import {IncomeExpense} from "./components/income_expense.js";
import {CreateOperation} from "./components/create_operation.js";
import {EditOperation} from "./components/edit_operation.js";

export class Router {
    constructor() {
        this.titleElement = document.getElementById('pageTitle');
        this.stylesElement = document.getElementById('templateStyle');
        this.templateContentElement = document.getElementById('templateContent');

        new Balance();

        this.routes = [
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                styles: 'styles/login.css',
                load: () => {
                    new Login();
                    new EntranceForm('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/login.css',
                load: () => {
                    new Login();
                    new EntranceForm('signup');
                }
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: '',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/income/new',
                title: 'Создание категории доходов',
                template: 'templates/income_create.html',
                styles: '',
                load: () => {
                    new IncomeCreate();
                }
            },
            {
                route: '#/income/edit',
                title: 'Редактирование категории доходов',
                template: 'templates/income_edit.html',
                styles: '',
                load: () => {
                    new IncomeEdit();
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/expense.html',
                styles: '',
                load: () => {
                    new Expense();
                }
            },
            {
                route: '#/expense/new',
                title: 'Создание категории расходов',
                template: 'templates/expense_create.html',
                styles: '',
                load: () => {
                    new ExpenseCreate();
                }
            },
            {
                route: '#/expense/edit',
                title: 'Редактирование категории расходов',
                template: 'templates/expense_edit.html',
                styles: '',
                load: () => {
                    new ExpenseEdit();
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'templates/income_expense.html',
                styles: 'styles/incomes_expenses.css',
                load: () => {
                    new IncomeExpense();
                }
            },
            {
                route: '#/operations/create_income',
                title: 'Создание дохода',
                template: 'templates/create_operation.html',
                styles: 'styles/incomes_expenses.css',
                load: () => {
                    new CreateOperation('income');
                }
            },
            {
                route: '#/operations/create_expense',
                title: 'Создание расхода',
                template: 'templates/create_operation.html',
                styles: 'styles/incomes_expenses.css',
                load: () => {
                    new CreateOperation('expense');
                }
            },
            {
                route: '#/operations/edit_operation',
                title: 'Редактирование дохода/расхода',
                template: 'templates/edit_operation.html',
                styles: 'styles/create_incomes_expenses.css',
                load: () => {
                    new EditOperation('incomeExpense');
                }
            },
        ];
    }

    async openRoute() {
        const currentUrlRoute = window.location.hash.split('?')[0];

        if (currentUrlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === currentUrlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        this.templateContentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;

        newRoute.load();
    }
}
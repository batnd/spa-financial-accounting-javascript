import {Balance} from "../utils/balance.js";
import {UserName} from "../utils/userName.js";
import {CategoriesTemplates} from "./categories_templates.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {CharPies} from "../addons/chart-pie.js";

export class Main {
    constructor() {
        this.incomeChartWrapperElement = document.querySelector('.incomes-chart-wrapper');
        this.expenseChartWrapperElement = document.querySelector('.expenses-chart-wrapper');
        this.filterButtonElements = document.querySelectorAll('.filterButton');
        this.filterDateFromInputElement = document.getElementById('filterDateFrom');
        this.intervalFilterInputConfig(this.filterDateFromInputElement);
        this.filterDateToInputElement = document.getElementById('filterDateTo');
        this.intervalFilterInputConfig(this.filterDateToInputElement);
        this.filterDateElement = document.querySelector('.filter-date');

        new CategoriesTemplates('main');

        this.chooseFilter();
        this.dataInit();
    }

    async dataInit() {
        await Balance.showBalance();
        await UserName.setUserName();
        await this.updateWithFilter('today');
    }

    chooseFilter() {
        const that = this;
        this.filterButtonElements.forEach(button => {
            if (button.getAttribute('id') !== 'interval') {
                button.addEventListener('click', function () {
                    that.clearInvalidIntervalFilter();
                    that.filterButtonElements.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    that.updateWithFilter(this.getAttribute('id'));
                });
            }
            if (button.getAttribute('id') === 'interval') {
                button.addEventListener('click', function () {
                    that.filterButtonElements.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    // that.removeIncomeExpenseCanvas();
                    const isFilterIntervalValid = that.validateIntervalFilter();
                    if (isFilterIntervalValid) {
                        that.updateWithFilter(this.getAttribute('id'));
                    }
                });
            }
        })
    }

    clearInvalidIntervalFilter() {
        const filterInvalidIntervalElement = document.querySelector('.filterInvalidInterval');
        if (filterInvalidIntervalElement) {
            filterInvalidIntervalElement.remove();
        }
        this.filterDateFromInputElement.classList.remove('filterDateEmpty');
        this.filterDateToInputElement.classList.remove('filterDateEmpty');
    }

    validateIntervalFilter() {
        const filterDateFromValue = this.filterDateFromInputElement.value;
        const filterDateToValue = this.filterDateToInputElement.value;
        const regex = /^[0-9]{2}.[0-9]{2}.[0-9]{4}$/;

        this.filterDateFromInputElement.classList.remove('filterDateEmpty');
        let dateFromIsValid = false;
        this.filterDateToInputElement.classList.remove('filterDateEmpty');
        let dateToIsValid = false;

        const filterInvalidIntervalElement = document.querySelector('.filterInvalidInterval');
        if (filterInvalidIntervalElement) {
            filterInvalidIntervalElement.remove();
        }

        if (!filterDateFromValue || !regex.test(filterDateFromValue)) {
            this.filterDateFromInputElement.classList.add('filterDateEmpty');
            dateFromIsValid = false;
        } else {
            dateFromIsValid = true;
        }
        if (!filterDateToValue || !regex.test(filterDateToValue)) {
            this.filterDateToInputElement.classList.add('filterDateEmpty');
            dateToIsValid = false;
        } else {
            dateToIsValid = true;
        }

        if (dateFromIsValid && dateToIsValid) {
            return true;
        } else {
            const filterInvalidInterval = document.createElement('p');
            filterInvalidInterval.className = 'm-0 filterInvalidInterval';
            filterInvalidInterval.innerText = 'Формат: дд.мм.гггг';
            this.filterDateElement.appendChild(filterInvalidInterval);
            return false;
        }
    }

    async updateWithFilter(filter) {
        let queryParamsPeriod = null;
        let dateFromSrc = this.filterDateFromInputElement.value.split('.');
        let dateFromOutput = `${dateFromSrc[2]}-${dateFromSrc[1]}-${dateFromSrc[0]}`;
        let dateToSrc = this.filterDateToInputElement.value.split('.');
        let dateToOutput = `${dateToSrc[2]}-${dateToSrc[1]}-${dateToSrc[0]}`;

        let today = new Date();
        let todayYear = today.getFullYear();
        let todayMonth = today.getMonth() < 9 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1);
        let todayDay = today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate();

        let todayFilter = `${todayYear}-${todayMonth}-${todayDay}`;

        switch (filter) {
            case 'today':
                queryParamsPeriod = 'period=interval&dateFrom=' + todayFilter + '&dateTo=' + todayFilter;
                break;
            case 'week':
                queryParamsPeriod = 'period=week';
                break;
            case 'month':
                queryParamsPeriod = 'period=month';
                break;
            case 'year':
                queryParamsPeriod = 'period=year';
                break;
            case 'all':
                queryParamsPeriod = 'period=all';
                break;
            case 'interval':
                queryParamsPeriod = 'period=interval&dateFrom=' + dateFromOutput + '&dateTo=' + dateToOutput;
                break;
        }
        try {
            const result = await CustomHttp.httpRequest(config.host + '/operations?' + queryParamsPeriod);
            if (result && result !== 400) {
                this.makeChartPies(result)
            }
        } catch (error) {
            console.log(error);
        }
    }

    intervalFilterInputConfig(inputElement) {
        const regex = /[0-9.]/;
        inputElement.addEventListener('keydown', function (event) {
            if (!regex.test(event.key) && event.key.toLowerCase() !== 'backspace' && event.key.toLowerCase() !== 'arrowleft' && event.key.toLowerCase() !== 'arrowright' && event.key.toLowerCase() !== 'tab') {
                event.preventDefault();
            }
        });
    }

    makeChartPies(operations) {
        this.removeIncomeExpenseCanvas();
        this.createIncomeExpenseCanvas();
        new CharPies(operations);
    }

    createIncomeExpenseCanvas() {
        const canvasIncome = document.createElement('canvas');
        canvasIncome.className = 'incomes-chart';
        canvasIncome.setAttribute('id', 'incomesChart');
        this.incomeChartWrapperElement.appendChild(canvasIncome);

        const canvasExpense = document.createElement('canvas');
        canvasExpense.className = 'expenses-chart';
        canvasExpense.setAttribute('id', 'expensesChart');
        this.expenseChartWrapperElement.appendChild(canvasExpense);
    }

    removeIncomeExpenseCanvas() {
        const incomeChartWrapperElement = document.getElementById('incomesChart');
        const expenseChartWrapperElement = document.getElementById('expensesChart');
        if (incomeChartWrapperElement) {
            incomeChartWrapperElement.remove();
        }
        if (expenseChartWrapperElement) {
            expenseChartWrapperElement.remove();
        }
    }
}
import {CategoriesTemplates} from "./categories_templates.js";
import {Balance} from "../utils/balance.js";
import {UserName} from "../utils/userName.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class IncomeExpense {
    constructor() {
        this.filterButtonElements = document.querySelectorAll('.filterButton');
        this.filterDateFromInputElement = document.getElementById('filterDateFrom');
        this.intervalFilterInputConfig(this.filterDateFromInputElement);
        this.filterDateToInputElement = document.getElementById('filterDateTo');
        this.intervalFilterInputConfig(this.filterDateToInputElement);
        this.filterDateElement = document.querySelector('.filter-date');

        this.operationsTableBody = document.getElementById('tableBody');

        this.createNewIncomeButtonElement = document.querySelector('.btn-createIncome');
        this.createNewIncomeButtonElement.addEventListener('click', () => location.href = '#/operations/create_income');
        this.createNewExpenseButtonElement = document.querySelector('.btn-createExpense');
        this.createNewExpenseButtonElement.addEventListener('click', () => location.href = '#/operations/create_expense');

        new CategoriesTemplates('incomeExpense');

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
                    // that.operationsTableBody.innerHTML = '';
                    const isFilterIntervalValid = that.validateIntervalFilter();
                    if (isFilterIntervalValid) {
                        that.updateWithFilter(this.getAttribute('id'));
                    }
                });
            }
        })
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

    clearInvalidIntervalFilter() {
        const filterInvalidIntervalElement = document.querySelector('.filterInvalidInterval');
        if (filterInvalidIntervalElement) {
            filterInvalidIntervalElement.remove();
        }
        this.filterDateFromInputElement.classList.remove('filterDateEmpty');
        this.filterDateToInputElement.classList.remove('filterDateEmpty');
        // this.filterDateFromInputElement.value = '';
        // this.filterDateToInputElement.value = '';
    }

    intervalFilterInputConfig(inputElement) {
        const regex = /[0-9.]/;
        inputElement.addEventListener('keydown', function (event) {
            if (!regex.test(event.key) && event.key.toLowerCase() !== 'backspace' && event.key.toLowerCase() !== 'arrowleft' && event.key.toLowerCase() !== 'arrowright' && event.key.toLowerCase() !== 'tab') {
                event.preventDefault();
            }
        });
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
                this.createIncomeExpenseOperations(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    createIncomeExpenseOperations(array) {
        this.operationsTableBody.innerHTML = '';
        if (array && array.length > 0) {
            array.forEach((operation, index) => {
                const tr = document.createElement('tr');
                tr.setAttribute('id', operation.id);
                tr.className = 'operation-element';

                const th = document.createElement('th');
                th.setAttribute('scope', "row");
                th.innerText = index + 1;

                const tdType = document.createElement('td');
                tdType.className = operation.type === 'income' ? 'text-success' : 'text-danger';
                tdType.innerText = operation.type === 'income' ? 'доход' : 'расход';

                const tdCategory = document.createElement('td');
                tdCategory.innerText = operation.category;

                const tdAmount = document.createElement('td');
                tdAmount.innerText = operation.amount;

                const tdDate = document.createElement('td');
                const dateSrc = operation.date.split('-');
                tdDate.innerText = dateSrc[2] + '.' + dateSrc[1] + '.' + dateSrc[0];

                const tdComment = document.createElement('td');
                tdComment.innerText = operation.comment;

                const tdActions = document.createElement('td');

                const divActions = document.createElement('div');
                divActions.className = 'operations-icons d-flex flex-row justify-content-end align-items-center';

                const aDelete = document.createElement('div');
                aDelete.className = 'deleteOperation d-flex justify-content-center align-items-center';
                const imgDelete = document.createElement('img');
                imgDelete.setAttribute('src', '../static/images/icon-delete.png');
                imgDelete.setAttribute('alt', 'Удалить');
                aDelete.addEventListener('click', () => {
                    this.deleteIncomeExpense(tr.getAttribute('id'));
                });

                const aEdit = document.createElement('div');
                aEdit.className = 'editOperation d-flex justify-content-center align-items-center';
                const imgEdit = document.createElement('img');
                imgEdit.setAttribute('src', '../static/images/icon-edit.png');
                imgEdit.setAttribute('alt', 'Удалить');
                aEdit.addEventListener('click', () => {
                    const operationType = operation.type === 'income' ? 'income' : 'expense';
                    location.href = '#/operations/edit_operation' + '?id=' + operation.id;
                });

                tr.appendChild(th);
                tr.appendChild(tdType);
                tr.appendChild(tdCategory);
                tr.appendChild(tdAmount);
                tr.appendChild(tdDate);
                tr.appendChild(tdComment);
                tr.appendChild(tdActions);
                tdActions.appendChild(divActions);
                divActions.appendChild(aDelete);
                aDelete.appendChild(imgDelete);
                divActions.appendChild(aEdit);
                aEdit.appendChild(imgEdit);

                this.operationsTableBody.appendChild(tr);
            });
        }
    }

    deleteIncomeExpense(id) {
        const templateContentElement = document.getElementById('templateContent');
        const modalWrapper = document.createElement('div');

        modalWrapper.className = 'show action-modal position-absolute h-100 w-100 align-items-center justify-content-center';
        modalWrapper.setAttribute('id', 'modalIncomeExpense');

        const modalContent = document.createElement('div');
        modalContent.className = 'action-modal-content modal-content bg-body';

        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body d-flex flex-column justify-content-between align-items-center';

        const modalText = document.createElement('p');
        modalText.className = 'action-modal-text m-0';
        modalText.innerText = 'Вы действительно хотите удалить операцию?';

        const modalActionWrapper = document.createElement('div');
        modalActionWrapper.className = 'action-buttons d-flex justify-content-center';

        const actionEdit = document.createElement('button');
        actionEdit.className = 'btn-common btn-modal-delete btn border-0 btn-success';
        actionEdit.innerText = 'Да, удалить';

        const actionCancel = document.createElement('button');
        actionCancel.className = 'btn-common btn-modal-no-delete btn border-0 btn-danger';
        actionCancel.setAttribute('id', 'balanceActionCancel');
        actionCancel.innerText = 'Не удалять';

        modalWrapper.appendChild(modalContent);
        modalContent.appendChild(modalBody);
        modalBody.appendChild(modalText);
        modalBody.appendChild(modalActionWrapper);
        modalActionWrapper.appendChild(actionEdit);
        modalActionWrapper.appendChild(actionCancel);

        templateContentElement.after(modalWrapper);

        modalWrapper.addEventListener('click', (event) => {
            if (event.eventPhase === 2) {
                this.removeModalIncomeExpense();
            }
        });
        actionCancel.addEventListener('click', () => {
            this.removeModalIncomeExpense();
        });
        actionEdit.addEventListener('click', async () => {
            let currentFilter = null;
            for (const filter of this.filterButtonElements) {
                if (filter.classList.contains('active')) {
                    currentFilter = filter;
                    break;
                }
            }
            try {
                const result = await CustomHttp.httpRequest(config.host + '/operations/' + id, 'DELETE');
                if (result && result !== 404) {
                    modalWrapper.remove();
                    await this.updateWithFilter(currentFilter.getAttribute('id'));
                    await Balance.showBalance();
                } else {
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    removeModalIncomeExpense() {
        document.querySelectorAll('#modalIncomeExpense').forEach(element => element.remove());
    }
}
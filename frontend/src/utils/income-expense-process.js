import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class IncomeExpenseProcess {
    static async getCategoriesIncomeExpense(route) {
        if (route === 'income') {
            try {
                const result = await CustomHttp.httpRequest(config.host + '/categories/income');
                if (result) {
                    return result;
                }
            } catch (error) {
                console.log(error);
            }

        }
        if (route === 'expense') {
            try {
                const result = await CustomHttp.httpRequest(config.host + '/categories/expense');
                if (result) {
                    return result;
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    static createIncomeExpense(array) {
        if (array && array.length > 0) {
            const categoriesElement = document.querySelector('.categories');
            array.forEach(arrayItem => {
                const categoryItemElement = document.createElement('div');
                categoryItemElement.setAttribute('id', arrayItem.id);
                categoryItemElement.className = 'category-item card flex-shrink-0';

                const categoryItemBodyElement = document.createElement('div');
                categoryItemBodyElement.className = 'category-item-body d-flex flex-column justify-content-between card-body';

                const categoryTitleElement = document.createElement('p');
                categoryTitleElement.className = 'category-title m-0';
                categoryTitleElement.innerText = arrayItem.title;

                const categoryItemButtonsElement = document.createElement('div');
                categoryItemButtonsElement.className = 'category-item-buttons d-flex';


                const buttonEditElement = document.createElement('button');
                buttonEditElement.className = 'btn-common btn-edit btn btn-primary';
                buttonEditElement.innerText = 'Редактировать';

                const buttonDeleteElement = document.createElement('button');
                buttonDeleteElement.className = 'btn-common btn-delete btn btn-danger';
                buttonDeleteElement.innerText = 'Удалить';

                categoryItemElement.appendChild(categoryItemBodyElement);
                categoryItemBodyElement.appendChild(categoryTitleElement);
                categoryItemBodyElement.appendChild(categoryItemButtonsElement);
                categoryItemButtonsElement.appendChild(buttonEditElement);
                categoryItemButtonsElement.appendChild(buttonDeleteElement);

                categoriesElement.prepend(categoryItemElement);
            });
        }
    }

    static deleteIncomeExpense(route, id, categoryName) {
        const routeIncome = 'income';
        const routeExpense = 'expense';

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
        const category = route === routeIncome ? 'доходы' : 'расходы';
        modalText.innerText = `Вы действительно хотите удалить категорию? Связанные ${category} будут удалены навсегда.`;

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
            if (route === routeIncome) {
                await IncomeExpenseProcess.deleteCurrentCategoryOperations(categoryName, route);
                try {
                    const result = await CustomHttp.httpRequest(config.host + '/categories/income/' + id, 'DELETE');
                    if (result && !result.error) {
                        modalWrapper.remove();
                        location.href = '#/income';
                    }
                } catch (error) {
                    console.log(error);
                }

            }
            if (route === routeExpense) {
                await IncomeExpenseProcess.deleteCurrentCategoryOperations(categoryName, route);
                try {
                    const result = await CustomHttp.httpRequest(config.host + '/categories/expense/' + id, 'DELETE');
                    if (result && !result.error) {
                        modalWrapper.remove();
                        location.href = '#/expense';
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    static async deleteCurrentCategoryOperations(categoryName, type) {
        const getAllOperations = await CustomHttp.httpRequest(config.host + '/operations?period=all');
        if (getAllOperations) {
            let allCurrentCategoryOperations = getAllOperations.filter(operation => {
                return operation.category === categoryName && operation.type === type;
            });
            if (allCurrentCategoryOperations && allCurrentCategoryOperations.length > 0) {
                allCurrentCategoryOperations.forEach(operation => {
                    CustomHttp.httpRequest(config.host + '/operations/' + operation.id, 'DELETE');
                });
            }
        }
    }

    static removeModalIncomeExpense() {
        document.querySelectorAll('#modalIncomeExpense').forEach(element => element.remove());
    }

    static async getIncomeExpense(route, id) {
        if (route === 'income') {
            try {
                const result = await CustomHttp.httpRequest(config.host + '/categories/income/' + id);
                if (result && result !== 404) {
                    return result.title;
                }
                if (result === 404) {
                    location.href = '#/income';
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (route === 'expense') {
            try {
                const result = await CustomHttp.httpRequest(config.host + '/categories/expense/' + id);
                if (result && result !== 404) {
                    return result.title;
                }
                if (result === 404) {
                    location.href = '#/expense';
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    static async editIncomeExpense(route, id, value) {
        if (route === 'income') {
            try {
                const result = await CustomHttp.httpRequest(config.host + '/categories/income/' + id, 'PUT', {
                    title: value
                });
                if (result) {
                    location.href = '#/income'
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (route === 'expense') {
            try {
                const result = await CustomHttp.httpRequest(config.host + '/categories/expense/' + id, 'PUT', {
                    title: value
                });
                if (result) {
                    location.href = '#/expense'
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
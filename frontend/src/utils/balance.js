import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Balance {
    constructor() {
        this.templateContentElement = document.getElementById('templateContent');
        this.currentBalanceWrapperElement = document.getElementById('currentBalanceWrapper');

        this.setBalanceEventDefinition();
    }

    setBalanceEventDefinition() {
        this.currentBalanceWrapperElement.addEventListener('click', () => {
            this.createBalanceModal();
        });
    }

    createBalanceModal() {
        const modalWrapper = document.createElement('div');
        modalWrapper.className = 'show action-modal position-absolute h-100 w-100 align-items-center justify-content-center';
        modalWrapper.setAttribute('id', 'modalBalanceWrapper');

        const modalContent = document.createElement('div');
        modalContent.className = 'action-modal-content modal-content bg-body';

        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body d-flex flex-column justify-content-between align-items-center';

        const modalText = document.createElement('p');
        modalText.className = 'action-modal-text m-0';
        modalText.innerText = 'Укажите текущий баланс ($) :';

        const modalInput = document.createElement('input');
        modalInput.setAttribute('id', 'balanceInput');
        modalInput.setAttribute('type', 'text');
        modalInput.className = 'w-75 form-control text-center';

        const modalActionWrapper = document.createElement('div');
        modalActionWrapper.className = 'action-buttons d-flex justify-content-center';

        const actionEdit = document.createElement('button');
        actionEdit.className = 'btn-common btn-modal-delete btn border-0 btn-success';
        actionEdit.innerText = 'ОК';

        const actionCancel = document.createElement('button');
        actionCancel.className = 'btn-common btn-modal-no-delete btn border-0 btn-danger';
        actionCancel.setAttribute('id', 'balanceActionCancel');
        actionCancel.innerText = 'Отмена';

        modalWrapper.appendChild(modalContent);
        modalContent.appendChild(modalBody);
        modalBody.appendChild(modalText);
        modalBody.appendChild(modalInput);
        modalBody.appendChild(modalActionWrapper);
        modalActionWrapper.appendChild(actionEdit);
        modalActionWrapper.appendChild(actionCancel);

        this.templateContentElement.after(modalWrapper);

        modalWrapper.addEventListener('click', (event) => {
            if (event.eventPhase === 2) {
                this.removeBalanceModal();
            }
        });
        actionCancel.addEventListener('click', () => {
            this.removeBalanceModal();
        });
        actionEdit.addEventListener('click', async () => {
            modalInput.classList.remove('border-danger');
            if (modalInput.value) {
                try {
                    const result = await this.setNewBalance(parseInt(modalInput.value));
                    if (result) {
                        await Balance.showBalance().then();
                        this.removeBalanceModal();
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                modalInput.classList.add('border-danger');
            }
        });
        modalInput.addEventListener('keydown', function (event) {
            const regex = /[0-9]/
            if (!regex.test(event.key) && event.key.toLowerCase() !== 'backspace') {
                event.preventDefault();
                return false;
            }
        });
    }

    removeBalanceModal() {
        document.querySelectorAll('#modalBalanceWrapper').forEach(element => element.remove());
    }

    async setNewBalance(newBalance) {
        const result = await CustomHttp.httpRequest(config.host + '/balance', 'PUT', {
            newBalance: newBalance
        });
        return result ? true : false;
    }

    static async showBalance() {
        const currentBalanceElement = document.getElementById('currentBalance');
        try {
            const result = await CustomHttp.httpRequest(config.host + '/balance');
            if (result) {
                currentBalanceElement.innerText = `${result.balance}$`;
                return result;
            } else {
                currentBalanceElement.innerText = 0;
                return 0;
            }
        } catch (error) {
            console.log(error);
        }
    }

}
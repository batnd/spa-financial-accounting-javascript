export class CharPies {
    constructor(operations) {
        this.allOperations = operations;
        this.totalIncomeAmountElement = document.getElementById('totalIncomeAmount');
        this.totalExpenseAmountElement = document.getElementById('totalExpenseAmount');
        this.barColorsValue = [
            "#d73948",
            "#f87e2e",
            "#fbbf36",
            "#32c699",
            "#176ff7",
            "#f117f8",
            "#641798",
            "#4b1b38",
            "#ffc193",
            "#9a4300",
            "#88d375",
            "#e17383",
            "#0e10ce",
            "#a8a8d2",
            "#c4a14d",
            "#d3f183",
            "#b9fdea",
            "#ac44ff",
            "#b67fa3",
            "#72834a",
            "#a40000",
        ];
        this.barColorEmpty = ["#dadada"];

        this.incomesChart = document.getElementById("incomesChart").getContext("2d");
        this.expensesChart = document.getElementById("expensesChart").getContext("2d");

        this.incomeOperations = this.getOperationsByType('income');
        this.expenseOperations = this.getOperationsByType('expense');

        const [incomeCategoriesNames, incomeTypeHasValue, incomeCategoriesAmount] = this.prepareTypeData(this.incomeOperations, 'income');
        const [expenseCategoriesNames, expenseTypeHasValue, expenseCategoriesAmount] = this.prepareTypeData(this.expenseOperations, 'expense');

        this.createChart(this.incomesChart, incomeCategoriesNames, incomeTypeHasValue, incomeCategoriesAmount);
        this.createChart(this.expensesChart, expenseCategoriesNames, expenseTypeHasValue, expenseCategoriesAmount);

    }

    createChart(canvasElement, labels, colors, data) {
        new Chart(canvasElement, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: colors ? this.barColorsValue : this.barColorEmpty,
                    data: data,
                    hoverOffset: 5,
                    borderWidth: 1,
                }],
            },
            options: {
                layout: {
                    padding: {
                        top: -10,
                    }
                },
                title: {
                    display: false,
                    text: "World Wide Wine Production 2018"
                },
                radius: 180,
                plugins: {
                    legend: {
                        labels: {
                            color: "black",
                            font: {
                                size: 12,
                                weight: 500,
                                family: "'Roboto', sans-serif",
                            },
                            boxWidth: 35,
                            padding: 10
                        },
                    }
                }
            }
        });
    }

    getOperationsByType(type) {
        return this.allOperations.filter(operation => {
            return operation.type === type;
        });
    }

    prepareTypeData(operationsByType, type) {
        const allOperationsArray = this.allOperations;

        let typeHasValue = true;
        let categoriesNames = [];
        operationsByType.forEach(operation => {
            if (categoriesNames.includes(operation.category)) {
                return;
            }
            categoriesNames.push(operation.category);
        });
        if (categoriesNames.length === 0) {
            categoriesNames[0] = 'Нет данных';
        }

        let categoriesAmount = [];
        categoriesNames.forEach(category => {
            let categoryAmount = 0;
            for (let i = 0; i < allOperationsArray.length; i++) {
                if (category === allOperationsArray[i].category && allOperationsArray[i].type === type) {
                    categoryAmount += allOperationsArray[i].amount;
                }
            }
            categoriesAmount.push(categoryAmount);
        });

        let totalCategoriesAmount = null;
        if (categoriesAmount.length > 0 && categoriesAmount[0] === 0) {
            categoriesAmount[0] = 1;
            typeHasValue = false;
            totalCategoriesAmount = 'нет данных';
        } else {
            totalCategoriesAmount = categoriesAmount.reduce((acc, currentValue) => acc + currentValue, 0);
        }

        if (type === 'income') {
            this.totalIncomeAmountElement.innerText = totalCategoriesAmount === 'нет данных' ? totalCategoriesAmount : totalCategoriesAmount + ' $';
        }
        if (type === 'expense') {
            this.totalExpenseAmountElement.innerText = totalCategoriesAmount === 'нет данных' ? totalCategoriesAmount : totalCategoriesAmount + ' $';
        }
        return [categoriesNames, typeHasValue, categoriesAmount];
    }
}
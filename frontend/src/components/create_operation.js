import {CategoriesTemplates} from "./categories_templates.js";
import {OperationActions} from "./operation_actions.js";

export class CreateOperation {
    constructor(route) {
        this.currentRoute = route;
        this.currentCategory = 'create';
        new CategoriesTemplates('incomeExpense');
        new OperationActions(this.currentRoute, this.currentCategory);
    }
}
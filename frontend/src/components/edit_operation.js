import {CategoriesTemplates} from "./categories_templates.js";
import {OperationActions} from "./operation_actions.js";

export class EditOperation {
    constructor(route) {
        this.currentRoute = route;
        this.currentCategory = 'edit';
        new CategoriesTemplates('incomeExpense');
        new OperationActions(this.currentRoute, this.currentCategory);
    }
}
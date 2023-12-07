import {CategoriesTemplates} from "./categories_templates.js";
import {CategoriesEdit} from "./categories_edit.js";

export class ExpenseEdit {
    constructor() {
        this.page = 'expense';
        new CategoriesTemplates(this.page);
        new CategoriesEdit(this.page);
    }
}
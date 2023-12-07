import {CategoriesTemplates} from "./categories_templates.js";
import {CategoriesEdit} from "./categories_edit.js";

export class IncomeEdit {
    constructor() {
        this.page = 'income';
        new CategoriesTemplates(this.page);
        new CategoriesEdit(this.page);
    }
}
import {CategoriesTemplates} from "./categories_templates.js";
import {CategoriesCreate} from "./categories_create.js";

export class ExpenseCreate {
    constructor() {
        this.page = 'expense';
        new CategoriesTemplates(this.page);
        new CategoriesCreate(this.page);
    }
}
import {CategoriesTemplates} from "./categories_templates.js";
import {CategoriesMain} from "./categories_main.js";

export class Expense {
    constructor() {
        this.page = 'expense';
        new CategoriesTemplates(this.page);
        new CategoriesMain(this.page);
    }
}
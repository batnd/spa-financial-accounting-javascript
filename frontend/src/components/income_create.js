import {CategoriesTemplates} from "./categories_templates.js";
import {CategoriesCreate} from "./categories_create.js";

export class IncomeCreate {
    constructor() {
        this.page = 'income';
        new CategoriesTemplates(this.page);
        new CategoriesCreate(this.page);
    }
}
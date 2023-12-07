import {CategoriesTemplates} from "./categories_templates.js";
import {CategoriesMain} from "./categories_main.js";

export class Income {
    constructor() {
        this.page = 'income';
        new CategoriesTemplates(this.page);
        new CategoriesMain(this.page);
    }
}
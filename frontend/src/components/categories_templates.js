export class CategoriesTemplates {
    constructor(route) {
        this.currentRoute = route;
        this.incomeRoute = 'income';
        this.expenseRoute = 'expense';
        this.incomeExpenseRoute = 'incomeExpense';
        this.mainRoute = 'main';

        this.commonElementsDefinition();
        this.commonSideBarTemplate(this.currentRoute);
    }

    commonElementsDefinition() {
        this.commonTemplateMainElement = document.getElementById('templateMain');
        this.commonTemplateSidebarElement = document.getElementById('templateSidebar');
        this.commonTemplateContentElement = document.getElementById('templateContent');
        this.commonTemplateSideBarNavItemsElements = document.querySelectorAll('.nav-item');
        this.commonTemplateSideBarCategoryButtonElement = document.getElementById('sideBarCategoryButton');
        this.commonTemplateSideBarCategoriesElement = document.getElementById('home-collapse');
        this.commonTemplateLinksIncExpElement = document.querySelectorAll('.sidebar-nav-collapse');
        this.commonTemplateLinkIncomeButtonElement = document.getElementById('linkIncome');
        this.commonTemplateLinkExpenseButtonElement = document.getElementById('linkExpense');
    }

    commonSideBarTemplate(route) {
        this.commonTemplateMainElement.className = 'd-flex flex-row min-vh-100 position-relative';
        this.commonTemplateSidebarElement.className = 'min-vh-100 sidebar d-flex flex-column justify-content-between flex-shrink-0 border-end';
        this.commonTemplateContentElement.className = 'container h-100 m-0';
        this.commonTemplateSideBarNavItemsElements.forEach(navItem => navItem.classList.remove('nav-item-active'));
        if (route === this.mainRoute || route === this.incomeExpenseRoute) {
            this.commonTemplateSideBarCategoryButtonElement.classList.add('collapsed');
            this.commonTemplateSideBarCategoryButtonElement.setAttribute('aria-expanded', "false");
            this.commonTemplateSideBarCategoriesElement.classList.remove('show');
            if (route === this.mainRoute) this.commonTemplateSideBarNavItemsElements[0].classList.add('nav-item-active');
            if (route === this.incomeExpenseRoute) this.commonTemplateSideBarNavItemsElements[1].classList.add('nav-item-active');
        }
        if (route === this.incomeRoute || route === this.expenseRoute) {
            this.commonTemplateSideBarNavItemsElements[2].classList.add('nav-item-active');
            this.commonTemplateSideBarCategoryButtonElement.classList.remove('collapsed');
            this.commonTemplateSideBarCategoryButtonElement.setAttribute('aria-expanded', "true");
            this.commonTemplateSideBarCategoriesElement.classList.add('show');
        }
        this.commonTemplateLinksIncExpElement.forEach(link => link.classList.remove('nav-element-active'));
        if (route === this.incomeRoute) {
            this.commonTemplateLinkIncomeButtonElement.classList.add('nav-element-active');
        }
        if (route === this.expenseRoute) {
            this.commonTemplateLinkExpenseButtonElement.classList.add('nav-element-active');
        }
    }
}
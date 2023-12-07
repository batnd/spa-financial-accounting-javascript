export class Login {
    constructor() {
        this.templateContentElement = document.getElementById('templateContent');
        this.templateMainElement = document.getElementById('templateMain');
        this.templateSidebarElement = document.getElementById('templateSidebar');

        this.templateLoginSignup();
    }

    templateLoginSignup() {
        this.templateMainElement.className = '';
        this.templateSidebarElement.classList.add('d-none');
        this.templateContentElement.className = '';
    }
}
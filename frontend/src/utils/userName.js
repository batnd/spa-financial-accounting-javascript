import {Auth} from "../services/auth.js";

export class UserName {
    static async setUserName() {
        const userDataElement = document.getElementById('userData');
        const userData = Auth.getUserInfo();
        if (userData) {
            userDataElement.innerText = `${userData.name} ${userData.lastName}`;
        } else {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }
    }
}
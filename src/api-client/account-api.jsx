import axios, { HttpStatusCode } from "axios";

class AccountClient {
    //если код ответа будет 500, то что-то вывести
    //передавать модель, а не данные
    constructor(host) {
        this.host = "https://localhost:7052/";
    }

    async registerAccount(email, password) {
        try {
            const uri = "api/Auth/Register";
            var response = await axios.post(`${this.host}${uri}`, { email, password });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                if (error.response.status != HttpStatusCode.Ok) {
                    throw new Error(error.response.data.message);
                }
            }
        }
    }

    async login(email, password) {
        try {
            const uri = "api/Auth/LoginByPassword";
            var response = await axios.post(`${this.host}${uri}`, { email, password });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                if (error.response.status != HttpStatusCode.Ok) {
                    throw new Error(error.response.data.message);
                }
            }
        }     
    }

    async resetPassword(email, password) {
        try {
            const uri = "api/Auth/ResetPassword";
            var response = await axios.post(`${this.host}${uri}`, { email, password });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                if (error.response.status != HttpStatusCode.Ok) {
                    throw new Error(error.response.data.message);
                }
            }
        }
    }

    async sendCodeToEmail(email) {
        try {
              //возможно понадобятся остальные данные
            const uri = "api/Notification/SendCodeToEmail";
            var response = await axios.post(`${this.host}${uri}`, { email });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                if (error.response.status != HttpStatusCode.Ok) {
                    throw new Error(error.response.data.message);
                }
            }
        }
    }
}
export default AccountClient; 
import axios, { HttpStatusCode } from "axios";

class AccountClient {
    //нужно чтобы не писать постоянно хост
    //если код ответа будет 500, то что-то вывести
    //передавать модель, а не данные
    constructor(host) {
        this.host = "https://localhost:7299/";
    }


    async registerAccount(email, password) {
        try {
            const uri = "user/register";
            var response = await axios.post(`${this.host}${uri}`, { email, password });
            return response.data;
        }
        catch (error) {
            if (error.response.status != HttpStatusCode.Ok) {
                throw new Error(error.response.data.message);
            }
        }
    }





    async Login(email, password) {
        try {
            await axios.post('https://localhost:7150/account/login_by_password', { email, password })
        }
        catch (error) {
            if (error.response) {
                if (error.response.status === HttpStatusCode.BadRequest) {
                    throw new Error(error.response.data.message);
                }
            }
        }
    }






    async deleteAccount(id) {
        try {
            await axios.post('https://localhost:7150/account/delete_account', { id });
        } catch (error) {
            if (error.response && error.response.status === HttpStatusCode.BadRequest) {
                throw new Error(error.response.data.message);
            }
        }
    };

    async updateAccountPassword(id) {
        try {
            await axios.post('https://localhost:7150/account/delete_account', { id });
        } catch (error) {
            if (error.response && error.response.status === HttpStatusCode.BadRequest) {
                console.log(error.response.data.message);
            } else {
                console.log('Неизвестная ошибка', error.message);
            }
        }
    };
}
export default AccountClient; 
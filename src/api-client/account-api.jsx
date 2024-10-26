import axios, { HttpStatusCode } from "axios";

class AccountClient {
    //нужно чтобы не писать постоянно хост
    //если код ответа будет 500, то что-то вывести
    //передавать модель, а не данные
    constructor(host) {
        this.host = "https://localhost:7243/";
    }

    async registerAccount(email, password) {
        try {
            const uri = "auth/register";
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

    async Login(email, password) {
        try {
            const uri = "auth/login";
            var response = await axios.post(`${this.host}${uri}`, { email, password });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                if (error.response.status != HttpStatusCode.Ok) {
                    if (error.response.status === HttpStatusCode.NotFound || error.response.status === HttpStatusCode.BadRequest) {
                        throw new Error("Неверный логин и/или пароль");
                    }
                }
            }
        }
    }
}
export default AccountClient; 
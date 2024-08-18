import axios, { HttpStatusCode } from "axios";

class AccountClient {
//нужно чтобы не писать постоянно хост
//убедиться что код ответа ок
//если код ответа будет 500, то что-то вывести
//передавать модель, а не данные и возвращать ответ
constructor(host)
{
    this.host = "https://localhost:7299/";
}
    async registerAccount(email, password) {
        try {
            const uri = "account/register";
            const response = await axios.post(`${this.host}${uri}`, { email, password });

            if (response.status !== HttpStatusCode.Ok) {
                return response.data;
            } else if (response.status === HttpStatusCode.InternalServerError) {
                console.log("Не удается осуществить регистрацию. Повторите попытку позднее.");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === HttpStatusCode.BadRequest) {
                    throw new Error(error.response.data.message);
                }
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
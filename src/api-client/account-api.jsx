import axios, { HttpStatusCode } from "axios";

class AccountClient {
    //если код ответа будет 500, то что-то вывести
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
            var response = await axios.put(`${this.host}${uri}`, { email: email, newPassword: password });
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
            const uri = "api/Notification/SendCodeToEmail";
            var response = await axios.post(`${this.host}${uri}`, { recepientEmail: email });
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

    async saveProfile(newProfile) {
        try {
            const uri = "api/PetProfile/AddPetProfile";
            var response = await axios.post(`${this.host}${uri}`, newProfile);
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

    async getPetProfiles(accountId) {
        try {
            const uri = "api/PetProfile/GetPetProfilesByAccountId";
            var response = await axios.post(`${this.host}${uri}`,  accountId,  { headers: { 'Content-Type': 'application/json' } });
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

    async deletePetProfile(accountId) {
        try {
            const uri = "api/PetProfile/DeletePetProfile";
            var response = await axios.delete(`${this.host}${uri}?id=${accountId}`);
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
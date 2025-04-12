class AuthClient extends BaseApiClient {
    constructor(host) {
        super(host);
    }

    async registerAccount (formData) {
        try {
            const uri = "api/Auth/Register";
            const response = await axios.post(`${baseUrl}${uri}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status !== 200) {
                    throw new Error(error.response.data.message);
                }
            } 
        }
    };
    
    async updatePassword(accountId, oldPassword, newPassword) {
        try {
            const uri = "api/Auth/UpdatePassword";
            var response = await axios.put(`${this.host}${uri}`, { accountId: accountId, oldPassword: oldPassword, newPassword: newPassword });
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

    async isUserRegister(email, password) {
        try {
            const uri = "api/Auth/IsRegisterUser";
            var response = await axios.post(`${this.host}${uri}`, { email: email, newPassword: password });
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

    async isTheSameUserPassword(email, password) {
        try {
            const uri = "api/Auth/IsTheSameUserPassword";
            var response = await axios.post(`${this.host}${uri}`, { email: email, newPassword: password });
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
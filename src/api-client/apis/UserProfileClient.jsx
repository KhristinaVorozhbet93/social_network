class UserProfileClient extends BaseApiClient {
    constructor(host) {
        super(host);
    }

    async getUserProfile(accountId) {
        try {
            const uri = "api/UserProfile/GetUserProfileByAccountId";
            var response = await axios.get(`${this.host}${uri}?id=${accountId}`);
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

    async getUserProfileById(profileId) {
        try {
            const uri = "api/UserProfile/GetUserProfileById";
            var response = await axios.get(`${this.host}${uri}?id=${profileId}`);
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

    async updateUserProfile(editedProfile) {
        try {
            const uri = "api/UserProfile/UpdateUserProfile";
            var response = await axios.put(`${this.host}${uri}`, editedProfile);
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
class PetProfileClient extends BaseApiClient {
    constructor(host) {
        super(host);
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
            var response = await axios.post(`${this.host}${uri}`, accountId, { headers: { 'Content-Type': 'application/json' } });
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

    async getPetProfileById(profileId) {
        try {
            const uri = "api/PetProfile/GetPetProfileById";
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

    async deletePetProfile(petId, accountId) {
        try {
            const uri = "api/PetProfile/DeletePetProfile";
            var response = await axios.delete(`${this.host}${uri}?petId=${petId}&accountId=${accountId}`);
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

    async updatePetProfile(editedProfile) {
        try {
            const uri = "api/PetProfile/UpdatePetProfile";
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
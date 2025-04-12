class PhotoClient extends BaseApiClient {
    constructor(host) {
        super(host);
    }
    async addPetPhoto(formData) {
        try {
            const uri = "api/PetPhoto/AddPetPhoto";
            const response = await axios.post(`${this.host}${uri}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
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

    async addUserPhoto(formData) {
        try {
            const uri = "api/PersonalPhoto/AddPersonalPhoto";
            const response = await axios.post(`${this.host}${uri}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
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

    async setPhotoAsMain(petId, accountId, photoId) {
        try {
            const uri = "api/PetPhoto/SetMainPetPhoto";
            const response = await axios.post(`${this.host}${uri}`, { petId, accountId, photoId });
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

    async setUserPhotoAsMain(profileId, photoId) {
        try {
            const uri = "api/PersonalPhoto/SetMainPersonalPhoto";
            const response = await axios.post(`${this.host}${uri}`, { profileId, photoId });
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

    async deletePetPhotoInAlbum(photoId) {
        try {
            const uri = "api/PetPhoto/DeletePetPhoto";
            var response = await axios.delete(`${this.host}${uri}?photoId=${photoId}`);
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

    async deleteUserPhotoInAlbum(photoId) {
        try {
            const uri = "api/PersonalPhoto/DeletePersonalPhoto";
            var response = await axios.delete(`${this.host}${uri}?photoId=${photoId}`);
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

    async getPetPhotoInAlbum(accountId, petId) {
        try {
            const uri = "api/PetPhoto/BySearch";
            var response = await axios.get(`${this.host}${uri}?petId=${petId}&accountId=${accountId}`);
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

    async getUserPhotosInAlbum(profileId) {
        try {
            const uri = "api/PersonalPhoto/BySearch";
            var response = await axios.get(`${this.host}${uri}?profileId=${profileId}`);
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

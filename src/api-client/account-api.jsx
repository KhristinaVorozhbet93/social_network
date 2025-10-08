import axios, { HttpStatusCode } from "axios";

class BaseApiClient {
    constructor(host) {
        this.host = "https://localhost:7052/";

        axios.interceptors.request.use(config => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });

        axios.interceptors.response.use(response => {
            return response;
        }, error => {
            if (error.response && error.response.status === 403) {
                if (window.location.pathname !== '/profile/user/update') {
                    window.location.href = "/profile/user/update";
                }
                return;
            }
            return Promise.reject(error);
        });

        axios.interceptors.response.use(response => {
            return response;
        }, error => {
            if (error.response && error.response.status === 401) {
                if (window.location.pathname !== '/auth/login') {
                    window.location.href = "/auth/login";
                }
                return;
            }

            return Promise.reject(error);
        });
    }


    async registerAccount(formData) {
        try {
            const uri = "api/Auth/Register";
            const response = await axios.post(`${this.host}${uri}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

    async getPetProfiles(profileId) {
        try {
            const uri = "api/PetProfile/GetPetProfiles";
            var response = await axios.post(`${this.host}${uri}`, profileId, { headers: { 'Content-Type': 'application/json' } });
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

    async getPetProfileById(id) {
        try {
            const uri = "api/PetProfile/GetPetProfileById";
            var response = await axios.get(`${this.host}${uri}?id=${id}`);
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
            var response = await axios.delete(`${this.host}${uri}?petId=${petId}`);
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





    //photos
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

    //photos
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

    //photos
    async setPhotoAsMain(petId, profileId, photoId) {
        try {
            const uri = "api/PetPhoto/SetMainPetPhoto";
            const response = await axios.post(`${this.host}${uri}`, { petId, profileId, photoId });
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

    //photos
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

    //photos
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



    //photos
    async getPetPhotoInAlbum(profileId, petId) {
        try {
            const uri = "api/PetPhoto/BySearch";
            const response = await axios.post(`${this.host}${uri}`, {
                profileId: profileId,
                petId: petId,
                options: {
                    take: 10,
                    offset: 0
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


    //photos
    async getUserPhotosInAlbum(profileId, take, offset) {
        try {
            const uri = "api/PersonalPhoto/BySearch";
            const response = await axios.post(`${this.host}${uri}`,
                {
                    profileId: profileId,
                    options: {
                        take: take,
                        offset: offset
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








    //friends
    async findFriends(firstName, lastName) {
        try {
            const uri = "api/UserProfile/FindUserProfileByName";
            var response = await axios.post(`${this.host}${uri}`,
                {
                    firstName: firstName,
                    lastName: lastName,
                    options: {
                        take: 10,
                        offset: 0
                    }
                }
            );
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



    //friends 
    async getFriends(userId) {
        try {
            const uri = "api/FriendShip/GetFriendsWithInfo";

            const response = await axios.post(`${this.host}${uri}`,
                {
                    userId: userId,
                    options: {
                        take: 10,
                        offset: 0
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

    //friends 
    async isFriend(userId, frinedId) {
        try {
            const uri = "api/FriendShip/IsFriend";
            var response = await axios.get(`${this.host}${uri}?userId=${userId}&friendId=${frinedId}`);
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


    //friends 
    async sendRequestToFriend(userId, friendId) {
        try {
            const uri = "api/FriendShip/SendFriendRequest";
            const response = await axios.post(`${this.host}${uri}`, { userId, friendId });
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

    //friends
    async removeFriend(userId, friendId) {
        try {
            const uri = "api/FriendShip/DeleteFriend";
            const response = await axios.post(`${this.host}${uri}`, { userId, friendId });
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


    //friends
    async getSentFriendRequests(userId) {
        try {
            const uri = "api/FriendShip/GetSentRequest";
            const response = await axios.post(`${this.host}${uri}`,
                {
                    userId: userId,
                    options:
                    {
                        take: 10,
                        offset: 0
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

    //friends
    async getReceivedFriendRequests(userId) {
        try {
            const uri = "api/FriendShip/GetReceivedRequest";
            const response = await axios.post(`${this.host}${uri}`, {
                userId: userId,
                options:
                {
                    take: 10,
                    offset: 0
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

    //friends
    async acceptFriendRequest(userId, friendId) {
        try {
            const uri = "api/FriendShip/AcceptFriend";
            const response = await axios.put(`${this.host}${uri}`, {
                userId: userId,
                friendId: friendId
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

    //friends
    async rejectFriendRequest(userId, friendId) {
        try {
            const uri = "api/FriendShip/RejectFriend";
            const response = await axios.put(`${this.host}${uri}`, {
                userId: userId,
                friendId: friendId
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

    //friends
    async hasSentRequest(userId, frinedId) {
        try {
            const uri = "api/FriendShip/HasSentRequest";
            var response = await axios.post(`${this.host}${uri}`,
                {
                    userId: userId,
                    friendId: frinedId
                }
            );
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




    //comments
    async addCommentToPhoto(userId, photoId, text) {
        try {
            const uri = "api/Comment/AddComment";
            const response = await axios.post(`${this.host}${uri}`, { userId, photoId, text });
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

    //comments
    async getCommentsForPhoto(photoId) {
        try {
            const uri = "api/Comment/GetAllCommentToPhoto";
            const response = await axios.post(`${this.host}${uri}`, {
                photoId: photoId,
                options:
                {
                    take: 10,
                    offset: 0
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

    //comments
    async updateComment(commetId, text) {
        try {
            const uri = "api/Comment/UpdateComment";
            const response = await axios.put(`${this.host}${uri}`, {
                id: commetId,
                text: text
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

    //comments
    async deleteComment(commentId) {
        try {
            const uri = "api/Comment/DeleteComment";
            var response = await axios.delete(`${this.host}${uri}?commentId=${commentId}`);
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





    //chat
    async addChat(friendIds) {
        try {
            const uri = "api/Chat/AddChat";
            const request = {
                friendIds: friendIds
            };
            const response = await axios.post(`${this.host}${uri}`, request);
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status !== HttpStatusCode.Ok) {
                    throw new Error(error.response.data.message);
                }
            }
            throw error;
        }
    }

    //chat
    async getOrCreateChat(friendIds) {
        try {
            const uri = "api/Chat/GetOrCreateChat";
            const request = {
                friendIds: friendIds
            };
            const response = await axios.post(`${this.host}${uri}`, request);
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status !== HttpStatusCode.Ok) {
                    throw new Error(error.response.data.message);
                }
            }
            throw error;
        }
    }

    //chat
    async getChats(userId) {
        try {
            const uri = "api/Chat/BySearch";
            const request = {
                userId: userId,
                options: {
                    take: 10,
                    offset: 0
                }
            };

            const response = await axios.post(`${this.host}${uri}`, request);
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

    //chat
    async deleteChat(chatId) {
        try {
            const uri = "api/Chat/DeleteChat";
            var response = await axios.delete(`${this.host}${uri}?id=${chatId}`);
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

    //chat
    async getChatMessages(chatId, take, offset) {
        try {
            const uri = "api/Message/BySearch";
            const request = {
                chatId: chatId,
                options: {
                    take: 10,
                    offset: 0
                }
            };
            const response = await axios.post(`${this.host}${uri}`, request);
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




    //planner
    async addTask(text, date, profileId) {
        try {
            const uri = "api/PetPlanner/AddRecord";
            const request = {
                text: text,
                date: date,
                profileId: profileId
            };
            const response = await axios.post(`${this.host}${uri}`, request);
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status !== HttpStatusCode.Ok) {
                    throw new Error(error.response.data.message);
                }
            }
            throw error;
        }
    }


    //planner
    async getTasksForDate(date, profileId) {
        try {
            const uri = "api/PetPlanner/GetAllRecordsByDate";
            const request = {
                date: date,
                profileId: profileId,
                options: {
                    take: 10,
                    offset: 0
                }
            };

            const response = await axios.post(`${this.host}${uri}`, request);
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

    //planner
    async getTasksForPeriod(startDate, endDate, profileId) {
        try {
            const uri = "api/PetPlanner/GetAllRecordsByPeriod";
            const request = {
                startDate: startDate,
                endDate: endDate,
                profileId: profileId,
                options: {
                    take: 10,
                    offset: 0
                }
            };
            const response = await axios.post(`${this.host}${uri}`, request);
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

    //planner
    async deleteTask(taskId) {
        try {
            const uri = "api/PetPlanner/DeleteRecord";
            var response = await axios.delete(`${this.host}${uri}?id=${taskId}`);
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

    //planner
    async updateTask(taskId, text) {
        try {
            const uri = "api/PetPlanner/UpdateRecord";
            const request = {
                id: taskId,
                text: text
            };
            const response = await axios.post(`${this.host}${uri}`, request);
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
export default BaseApiClient; 
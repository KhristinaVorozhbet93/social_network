class FriendsClient extends BaseApiClient {
    constructor(host) {
        super(host);
    }
    
    async findFriends(firstName, LastName) {
        try {
            const uri = "api/UserProfile/FindUserProfileByName";
            var response = await axios.get(`${this.host}${uri}?firstName=${firstName}&lastName=${LastName}`);
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

    async getFriends(userId) {
        try {
            const uri = "api/FriendShip/GetFriendsWithInfo";
            var response = await axios.get(`${this.host}${uri}?userId=${userId}`);
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

    async getSentFriendRequests(userId) {
        try {
            const uri = "api/FriendShip/GetSentRequest";
            const response = await axios.get(`${this.host}${uri}?userId=${userId}`);
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

    async getReceivedFriendRequests(userId) {
        try {
            const uri = "api/FriendShip/GetReceivedRequest";
            const response = await axios.get(`${this.host}${uri}?userId=${userId}`);
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

    async hasSentRequest(userId, frinedId) {
        try {
            const uri = "api/FriendShip/HasSentRequest";
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
}

class ChatClient extends BaseApiClient {
    constructor(host) {
        super(host);
    }
    
    async addChat(friendId, userId) {
        try {
            const uri = "api/Chat/AddChat";
            const request = {
                userId: userId,
                friendIds: [friendId]
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

    async getChats(userId) {
        try {
            const uri = "api/Chat/BySearch";
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

    async getChatMessages(chatId) {
        try {
            const uri = "api/Message/BySearch";
            var response = await axios.get(`${this.host}${uri}?chatId=${chatId}`);
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
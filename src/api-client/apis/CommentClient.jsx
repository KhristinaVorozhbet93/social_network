class CommentClient extends BaseApiClient {
    constructor(host) {
        super(host);
    }

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

    async getCommentsForPhoto(photoId) {
        try {
            const uri = "api/Comment/GetAllCommentToPhoto";
            var response = await axios.get(`${this.host}${uri}?photoId=${photoId}`);
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
}



class NotificationClient extends BaseApiClient {
    constructor(host) {
        super(host);
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

}
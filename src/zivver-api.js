function isZivverMessage(messageHeaders) {
    // Check if email was sent by Zivver
    return messageHeaders['x-zivver-conversationid'] !== undefined ? true : false;
}

function getConversationId(messageHeaders) {
    return messageHeaders['x-zivver-conversationid'];
}

async function fetchMessage(conversationId, accessToken) {
    // Fetch message from Zivver API using conversation id
    const response = await fetch(`https://app.zivver.com/api/conversations/${conversationId}/messages`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) return null;

    const responseData = await response.json();
    return responseData['items'];
}

async function getAccessToken(refreshToken, username) {
    // Get access token from Zivver API using refresh token
    const response = await fetch(`https://app.zivver.com/api/authentication/login`, {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
            'username': username
        })
    });

    if (!response.ok) return null;

    const responseData = await response.json();
    return responseData;
}

class ZivverState {
    #refreshToken;
    #username;
    #accessToken;
    #accessTokenValidUntil;

    constructor(refreshToken, username) {
        this.#refreshToken = refreshToken;
        this.#username = username;
        this.#updateAccessToken();
    }

    async #checkAccessToken() {
        if (this.#accessTokenValidUntil < Date.now()) {
            return await this.#updateAccessToken();
        }
    }

    async #updateAccessToken() {
        const response = await getAccessToken(this.#refreshToken, this.#username);
        // Add expires_in to current time minus 10 seconds to avoid drift
        this.#accessTokenValidUntil = Date.now() + response['expires_in'] * 1000 - 10000;
        this.#accessToken = response['access_token'];
    }

    async getMessage(conversationId) {
        await this.#checkAccessToken();
        return await fetchMessage(conversationId, this.#accessToken);
    }
}

const exports = {
    isZivverMessage: isZivverMessage,
    getConversationId: getConversationId,
    ZivverState: ZivverState
};

if (typeof messenger !== 'undefined') {
    messenger.runtime.zivverApi = exports;
} else {
    module.exports = exports;
}
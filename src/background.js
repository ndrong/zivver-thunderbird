import './zivver-api.js';

const zivverApi = messenger.runtime.zivverApi;
const localStorage = messenger.storage.local;
let zivverState = null;

const initLocalStorage = async () => {
    const storageData = await localStorage.get({ 'refresh_token': '', 'username': '' });

    messenger.runtime.refreshToken = storageData.refresh_token;
    messenger.runtime.username = storageData.username;
};

const handleStartup = () => {
    // Register message display script
    messenger.messageDisplayScripts.register({
        js: [{ file: 'message-content-script.js' }],
        css: [{ file: 'message-content-styles.css' }]
    });

    // Initialize local storage
    initLocalStorage().then(() => {
        zivverState = new zivverApi.ZivverState(messenger.runtime.refreshToken, messenger.runtime.username);
    });
};

const handleMessage = async (sender) => {
    // Get active tab id from sender
    const { tab: { id: tabId } } = sender;
    const message = await browser.messageDisplay.getDisplayedMessage(tabId);

    const fullMessage = await messenger.messages.getFull(message.id)
    // Check if message is from Zivver
    if (!zivverApi.isZivverMessage(fullMessage.headers)) {
        return null;
    }
    printToConsole('Detected a Zivver message (subject: ' + message.subject + ')');

    const conversationId = zivverApi.getConversationId(fullMessage.headers);
    printToConsole('Conversation ID: ' + conversationId);

    const messageTrail = await zivverState.getMessage(conversationId);

    return messageTrail;
};

const printToConsole = (text) => {
    console.log(`%c[Zivver for Thunderbird]%c${text}`, 'background: #222; color: #bada55');
};

// Register message listener
messenger.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !message.hasOwnProperty('type')) {
        return false;
    }

    if (message.type === 'getMessageTrail') {
        return Promise.resolve(handleMessage(sender));
    }

    if (message.type === 'updateZivverState') {
        initLocalStorage().then(() => {
            zivverState = new zivverApi.ZivverState(messenger.runtime.refreshToken, messenger.runtime.username);
        });
        return Promise.resolve(true);
    }

    return false;
});

// Register scripts on load
document.addEventListener('DOMContentLoaded', handleStartup);
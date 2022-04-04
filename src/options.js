const localStorage = messenger.storage.local;

const refreshTokenElement = document.getElementById('refresh_token');
const usernameElement = document.getElementById('username');

function saveData() {
    localStorage.set({ 'refresh_token': refreshTokenElement.value, 'username': usernameElement.value });
    // Reload ZivverState in background.js to use new data
    messenger.runtime.sendMessage({ type: 'updateZivverState' });
}

async function loadData() {
    const data = await localStorage.get({ refresh_token: '', username: '' });

    refreshTokenElement.value = data.refresh_token;
    usernameElement.value = data.username;
}

function onSubmit(event) {
    event.preventDefault();
    saveData();
}

function onLoad() {
    loadData();
}

document.getElementById('options').addEventListener('submit', onSubmit);
onLoad();
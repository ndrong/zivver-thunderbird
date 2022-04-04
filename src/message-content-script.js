const showMessage = async () => {
    const messageTrail = await messenger.runtime.sendMessage({ type: 'getMessageTrail' });
    // Check whether this is a Zivver message
    if (messageTrail === null) {
        return;
    }

    let formattedMessage = new String();
    for (let message of messageTrail) {
        // Replace newlines with line breaks if message body is not already html
        let messageBody = (message['contentType'] === 'text/html') ? message.body : message.body.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        // Append to formatted message
        formattedMessage += `<div class='message-block'>${messageBody}</div>`;
    }

    // Replace current message with formatted messageTrail
    // TODO: make this look good
    document.body.innerHTML = formattedMessage;
};

showMessage();
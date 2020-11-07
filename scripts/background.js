async function markReadCurrentFolder() {
    let mailTabs = await messenger.mailTabs.query({
        "active": true,
        "currentWindow": true,
        "lastFocusedWindow": true
    });
    let queryResults = await messenger.messages.query({
        "folder": mailTabs[0].displayedFolder,
        "unread": true
    });
    let unreadMessages = queryResults.messages;
    for (let i = 0; i < unreadMessages.length; i++) {
        messenger.messages.update(unreadMessages[i].id, {
            "read": true
        });
    }
}

messenger.browserAction.onClicked.addListener((_tab) => {
    markReadCurrentFolder();
});
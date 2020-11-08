async function markReadCurrentFolder() {
    let mailTabs = await messenger.mailTabs.query({
        "active": true,
        "currentWindow": true,
        "lastFocusedWindow": true
    });
    let currentFolder = mailTabs[0].displayedFolder;

    let page = await messenger.messages.query({
        "folder": currentFolder,
        "unread": true
    });
    markReadMessages(page.messages);

    while (page.id) {
        page = await messenger.messages.continueList(page.id);
        markReadMessages(page.messages);
    }
}

async function markReadMessages(unreadMessages) {
    for (let i = 0; i < unreadMessages.length; i++) {
        messenger.messages.update(unreadMessages[i].id, {
            "read": true
        });
    }
}

messenger.browserAction.onClicked.addListener((_tab) => {
    markReadCurrentFolder();
});
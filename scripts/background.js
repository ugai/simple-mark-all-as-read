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
    await markReadMessages(page.messages);

    while (page.id) {
        page = await messenger.messages.continueList(page.id);
        await markReadMessages(page.messages);
    }
}

async function markReadMessages(unreadMessages) {
    for (let i = 0; i < unreadMessages.length; i++) {
        await messenger.messages.update(unreadMessages[i].id, {
            "read": true
        });
    }
}

messenger.browserAction.onClicked.addListener(async (_tab) => {
    await markReadCurrentFolder();
});

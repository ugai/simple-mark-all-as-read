async function markReadCurrentFolder() {
    console.log("markReadCurrentFolder()");

    let mailTabs = await messenger.mailTabs.query({
        active: true,
        currentWindow: true,
        lastFocusedWindow: true,
    });
    if (!mailTabs) {
        console.log("SMAAR: mailTabs is null.");
        return;
    }

    let currentFolder = mailTabs[0].displayedFolder;
    if (!currentFolder) {
        console.log("SMAAR: currentFolder is null.");
        return;
    }

    let page = await messenger.messages.query({
        folder: currentFolder,
        unread: true,
    });
    if (!page) {
        console.log("SMAAR: page is null.");
        return;
    }

    await markReadMessages(page.messages);

    while (page.id) {
        page = await messenger.messages.continueList(page.id);
        await markReadMessages(page.messages);
    }
}

async function markReadMessages(unreadMessages) {
    console.log("markReadMessages()");

    if (!unreadMessages) {
        console.log("SMAAR: unreadMessages is null.");
        return;
    }

    for (let i = 0; i < unreadMessages.length; i++) {
        console.log(unreadMessages[i]);
        await messenger.messages.update(unreadMessages[i].id, {
            read: true,
        });
    }
}

console.log("messenger.browserAction.onClicked.addListener()");
messenger.browserAction.onClicked.addListener(async (_tab) => await markReadCurrentFolder());

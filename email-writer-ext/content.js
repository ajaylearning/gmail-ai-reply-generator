console.log("Email writer extension - content script loaded");

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'ai-writer-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.width = '600px';
    modal.style.height = '500px';
    modal.style.backgroundColor = 'white';
    modal.style.border = '1px solid #ccc';
    modal.style.borderRadius = '8px';
    modal.style.zIndex = '10000';
    modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    modal.style.overflow = 'hidden';

    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('dist/index.html');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    modal.appendChild(iframe);

    return modal;
}

function openModal() {
    if (document.getElementById('ai-writer-modal')) {
        return;
    }
    const modal = createModal();
    document.body.appendChild(modal);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';

    closeButton.onclick = () => {
        modal.remove();
    };
    modal.appendChild(closeButton);
}

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.style.cursor = 'pointer';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'AI Reply');
    button.onclick = openModal;
    return button;
}

function findComposeToolBar() {
    const selectors = ['.aDh', '.btC', '[role="dialog"] .gU.Up'];
    for (const selector of selectors) {
        const toolBar = document.querySelector(selector);
        if (toolBar) {
            return toolBar;
        }
    }
    return null;
}

function injectButton() {
    const toolBar = findComposeToolBar();
    if (toolBar && !toolBar.querySelector('.ai-reply-button')) {
        const button = createAIButton();
        button.classList.add('ai-reply-button');
        toolBar.insertBefore(button, toolBar.firstChild);
    }
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            injectButton();
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
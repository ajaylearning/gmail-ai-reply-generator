// this will help us to add button in email
console.log("Email writer extention- content loaded")
function getEmailContent(){
    const selectors = ['.h7','.s3s.aiL', '[role="presentation"]','.gmail_quote'];
    for(const selector of selectors){
        const content = document.querySelector(selector);
        if(content){
            return content.innerText.trim();
        }
        return '';
    }
}

// function createAIButton(){
//     const button= document.createElement('div');
//     button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
//     button.style.marginRight= '8px';
//     button.innerHTML = 'AI Reply';
//     button.setAttribute('role','button');
//     button.setAttribute('data-tooltip','AI Reply');

//     return button;
// }
function createAIButton() {
    const button = document.createElement('div');
    button.setAttribute('class', 'T-I J-J5-Ji aoO v7 T-I-atl L3');
    // button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.style.cursor = 'pointer';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'AI Reply');
    return button;
}
function findComposeToolBar(){
    const selectors = ['.aDh','.btC', '[role="dialog"]','.gU.Up'];
    for(const selector of selectors){
        const toolBar = document.querySelector(selector);
        if(toolBar){
            return toolBar;
        }
        return null;
    }
}
function injectButton(){
    const existingButton = document.querySelector('.ai-reply-button')
        if(existingButton) existingButton.remove();

        const toolBar= findComposeToolBar();
        if (!toolBar){
            console.log("toolbar not found");
            return
        }

        console.log("toolbar found");
        const button = createAIButton();
        button.classList.add('ai-reply-button');

        button.addEventListener('click',async ()=> {

            try {
                button.innerHTML = 'Generating ...'
                button.disabled = true

                const emailContent = getEmailContent();

                const response= await fetch('http://localhost:8080/api/email/generate',{
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body : JSON.stringify({
                        emailContent: emailContent,
                        tone: "professional"
                    })
                });
                if(!response.ok){
                    throw new Error('API failed to fetch');
                }

                const generatedEmail= await response.text();
                console.log(generatedEmail);
                const composeBox = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');

                if(composeBox){
                    composeBox.focus();
                    composeBox.innerHTML = generatedEmail.replace(/\n/g, '<br>');

                }else{
                    console.log("Compose box not found");
                }

            } catch (error) {
                console.log("error :" , error);
                alert('Failed to generated reply');
            }finally{
                button.innerHTML = 'AI reply';
                button.disabled = false;
            }
        });

        toolBar.insertBefore(button, toolBar.firstChild);
    
}
const observer = new MutationObserver((mutations) =>{
   for(const mutation of mutations){
        const addedNodes =Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches(' .aDh,.btC, [role="dialog"]') || node.querySelector(' .aDh, .btC, [role="dialog"]'))
        );

        if(hasComposeElements){
            console.log("window detected")
            setTimeout(injectButton, 500);

        }
   } 
});

observer.observe(document.body ,{
    childList: true,
    subtree: true
});
// let port = 8080;
// let baseURL = `http://amazon-pricer-tracker-server-599563671.ap-south-1.elb.amazonaws.com`;
let port = 3000;
let baseURL = `http://localhost:3000/v1`;


chrome.runtime.onInstalled.addListener(details=>{
    console.log(details.reason);
    chrome.storage.sync.set({users : []});
})

let log_sign = async (request, response, url) => {
    try {
        const resp = await fetch(`${baseURL}/user/${url}`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: { "Content-type": "application/json" }
        });
        const res = await resp.json();
        if(res.success === true){
            chrome.storage.sync.set({ users: [res.data] });
            response({ user_logged_in: true });
        }
        else {
            chrome.storage.sync.set({ "user_login_errors": res.data });
            response({ user_logged_in: false });
        }
    }
    catch (err) {
        chrome.storage.sync.set({ "user_login_errors": err.message });
        response({ user_logged_in: false });
    }
}

let add_product = async (request,sender, response)=>{
    let ob = {name : request.name, url : request.url, current_price : request.currPrice, threshold_price : request.threshPrice, userId : request.userid}
    try {
        let resp = await fetch(`${baseURL}/addproduct`, {
            method: "POST",
            body: JSON.stringify(ob),
            headers: { "Content-type": "application/json" },
        })
        let res = await resp.json();
        if(res.success === true){
            response({success : true});
        }else{
            response({success : false});
        }
    }
    catch (err) {
        console.log(err);
        response({success : false});
    }
}

let remove_item = async (request, sender, response) => {
    let obj = { product_id: request.item_id, userId : request.userId };
    try {
        let resp = await fetch(`${baseURL}/remove_item`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: { "Content-type": "application/json" }
        });

        let res = await resp.json();
        if(res.success === true){
            response({ removed: true });
        }else{
            response({ removed: false});
        }
    }
    catch (err) {
        console.log(err);
        response({ removed: false });
    }
}


chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.type === "log_sign") {
        if (request.username) {
            log_sign(request, response, "signup")
        }
        else {
            log_sign(request, response, "login");
        }
        return true;
    }
    else if (request.type === "add_product") {
        add_product(request, sender, response);
        return true;
    }
    else if (request.type === "remove_item") {
        remove_item(request, sender, response);
        return true;
    }

})
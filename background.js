// let port = 8080;
// let baseURL = `http://amazon-pricer-tracker-server-599563671.ap-south-1.elb.amazonaws.com`;
let port = 3000;
let baseURL = `https://www.price-tracker.info/v1`;
// let baseURL = `http://localhost:3000/v1/`;
let manual_url = 'https://drive.google.com/file/d/1Ga_6jS2b8DtkMMjYigRZKFaBb2zkWsmm/view?usp=share_link';

chrome.runtime.onInstalled.addListener(details=>{
    console.log(details.reason);
    chrome.storage.sync.set({users : []});
    chrome.tabs.create({ url: manual_url }, function (tab) {
        console.log("New tab launched with user manual");
    });
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
    let ob = {name : request.name, url : request.url, seller : request.seller, current_price : request.currPrice, threshold_price : request.threshPrice, userId : request.userid}
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


let verify_product = async (request, sender, response) => {
    let obj = { url : request.url, userId : request.userId };
    console.log(obj);
    try {
        let resp = await fetch(`${baseURL}/verifyProduct`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: { "Content-type": "application/json" }
        });
        let res = await resp.json();
        let data = res.data;
        if(res.success === true){
            response({data : data});
        }else{
            response({data : {available: false}});
        }
    }
    catch (err) {
        console.log(err);
        response({data : {available: false}});
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
    }else if(request.type === "verify_product"){
        verify_product(request, sender, response);
        return true;
    }

})
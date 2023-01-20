// let port = 8080;
// let baseURL = `http://amazon-pricer-tracker-server-599563671.ap-south-1.elb.amazonaws.com`;
let port = 3000;
let baseURL = `https://www.price-tracker.info/v1`;
// let baseURL = `http://localhost:3000/v1/`;
let flipkart_price_selector = "._30jeq3";
let amazon_price_selector = ".a-offscreen";


let find_price = (price_str)=>{
    if(price_str === undefined || price_str === "unavailable"){
        return null;
    }else{
        return Math.floor(parseFloat(price_str.substr(1).replaceAll(",", "")));
    }

}


let find_price_str = (seller) => {
    let el;
    if (seller === 'flipkart') {
        el = document.querySelector(flipkart_price_selector);
    } else if (seller === 'amazon') {
        el = document.querySelector(amazon_price_selector);
    }
    return el.innerHTML;
}



chrome.storage.sync.get(["users", "selected_items"], (data) => {

    if (data.users.length == 1) {

        const product_title_el = document.querySelector("#productTitle");

        let product_addition = ()=>{

        let form_el = document.createElement("form");
        form_el.classList.add("form");

        let button_el = document.createElement("button");
        button_el.appendChild(document.createTextNode("Add to track"));

        const threshold_price_el = document.createElement("input");
        threshold_price_el.type = "number";
        threshold_price_el.appendChild(document.createTextNode(""));
        threshold_price_el.placeholder = "Enter the threshold value";
        threshold_price_el.required = true;
        threshold_price_el.classList.add("thresh_val");

        const br_el = document.createElement("br");

        const error_el = document.createElement("div");

        form_el.appendChild(threshold_price_el);
        form_el.appendChild(error_el);
        form_el.appendChild(button_el);

        product_title_el.appendChild(br_el);
        product_title_el.appendChild(form_el);

        let ob = { type: "add_product", url: "https://www.amazon.in/Redmi-Sporty-Orange-64GB-Storage/dp/B08696W3B3/ref=sr_1_1?dchild=1&keywords=redmi+note+7&qid=1625587510&sr=8-1", name: "redmi note 7", currPrice: 11000, threshPrice: 10000, userid: data.users[0].id };
        button_el.addEventListener("click", async (e) => {
            e.preventDefault();
            error_el.innerHTML = "";
            if (threshold_price_el.value == "") {
                error_el.innerHTML = "Please enter some value";
                error_el.style = "color : Red; font-weight : 350";
            }
            else {
                button_el.innerText = "Adding...";
                ob.threshPrice = threshold_price_el.value.replace(",", "");
                ob.name = product_title_el.innerText.substring(0, 15);
                ob.name += "..."
                ob.url = window.location.href;
                if(ob.url.includes("https://www.amazon.in")){
                    ob.seller = "amazon";
                }else if(ob.url.includes("https://www.flipkart.com")){
                    ob.seller = "flipkart";
                }
                let price_str = find_price_str(ob.seller);
                ob.currPrice = find_price(price_str);

                chrome.runtime.sendMessage(ob, (response) => {
                    if (response.success) {
                        button_el .innerHTML = "Added";
                        button_el .disabled = true;
                    }
                    else {
                        //code to handle errors
                    }
                })
            }

        })
        }


        let temp = {type : "verify_product", url : window.location.href, userId : data.users[0].id};


        chrome.runtime.sendMessage(temp, (response) => {
            if(response.data.available){
                let button_el = document.createElement("button");
                button_el.appendChild(document.createTextNode("Added"));
                const br_el = document.createElement("br");
                product_title_el.appendChild(br_el);
                product_title_el.appendChild(button_el);
                button_el.disabled = true;
            }
            else{
                product_addition();
            }
        })
    }
})

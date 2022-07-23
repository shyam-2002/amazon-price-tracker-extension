// let port = 8080;
// let baseURL = `http://amazon-pricer-tracker-server-599563671.ap-south-1.elb.amazonaws.com`;
let port = 3000;
let baseURL = `http://localhost:3000/v1`;

chrome.storage.sync.get(["users", "selected_items"], (data) => {

    if (data.users.length == 1) {

        const el = document.querySelector("#productTitle");

        let product_addition = ()=>{

        let form_el = document.createElement("form");
        form_el.classList.add("form");

        let new_el = document.createElement("button");
        new_el.appendChild(document.createTextNode("Add to track"));

        const new_el2 = document.createElement("input");
        new_el2.appendChild(document.createTextNode(""));
        new_el2.placeholder = "Enter the threshold value";
        new_el2.required = true;
        new_el2.classList.add("thresh_val");

        const newel3 = document.createElement("br");

        const error_el = document.createElement("div");

        form_el.appendChild(new_el2);
        form_el.appendChild(error_el);
        form_el.appendChild(new_el);

        el.appendChild(newel3);
        el.appendChild(form_el);

        let ob = { type: "add_product", url: "https://www.amazon.in/Redmi-Sporty-Orange-64GB-Storage/dp/B08696W3B3/ref=sr_1_1?dchild=1&keywords=redmi+note+7&qid=1625587510&sr=8-1", name: "redmi note 7", currPrice: 11000, threshPrice: 10000, userid: data.users[0].id };
        new_el.addEventListener("click", async (e) => {
            e.preventDefault();
            error_el.innerHTML = "";
            if (new_el2.value == "") {
                error_el.innerHTML = "Please enter some value";
                error_el.style = "color : Red; font-weight : 350";
            }
            else {
                new_el.innerText = "Adding...";
                ob.threshPrice = new_el2.value;
                let e1 = document.querySelector(".a-offscreen");
                let e2 = document.querySelector("#priceblock_ourprice");
                if (e1) {
                    ob.currPrice = parseInt(e1.innerHTML.substring(7).replaceAll(",", ""));
                }
                else {
                    ob.currPrice = parseInt(e2.innerHTML.substring(7).replaceAll(",", ""));
                }
                ob.url = window.location.href;
                if(ob.url.includes("https://www.amazon.in")){
                    ob.seller = "amazon";
                }else if(ob.url.includes("https://www.flipkart.com")){
                    ob.seller = "flipkart";
                }
                ob.name = el.innerText.substring(0, 15);
                ob.name += "..."
                console.log(ob);
                chrome.runtime.sendMessage(ob, (response) => {
                    if (response.success) {
                        new_el.innerHTML = "Added";
                        new_el.disabled = true;
                    }
                    else {
                        //code to handle errors
                    }
                })
            }

        })
        }


        let temp = {url : window.location.href, userId : data.users[0].id};


        fetch(`${baseURL}/verifyProduct`, {
            method : "POST",
            body : JSON.stringify(temp),
            headers : {"Content-type" : "application/json"}
        })
        .then(res=>{
            return res.json();
        })
        .then(response=>{
            if(response.data.available){
                let new_el = document.createElement("button");
                new_el.appendChild(document.createTextNode("Added"));

                let br_el = document.createElement('br');
                el.appendChild(br_el);
                el.appendChild(new_el);
                new_el.disabled = true;
            }
            else{
                product_addition();
            }
        })
        .catch(err=>{
            console.log(err);
        })

    }
})

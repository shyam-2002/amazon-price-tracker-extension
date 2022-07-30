// let port = 8080;
// let baseURL = `http://amazon-pricer-tracker-server-599563671.ap-south-1.elb.amazonaws.com`;
let port = 3000;
let baseURL = `http://awseb-awseb-lld2fl9uz4gd-316441135.ap-south-1.elb.amazonaws.com/v1`;
// let baseURL = `http://localhost:3000/v1/`;


window.onload = async () => {
    let cross = document.querySelector(".cross");
    let box = document.querySelector("#login-box");
    let home_btn = document.querySelector(".home");
    let search_btn = document.querySelector(".search");
    let account_btn = document.querySelector(".account");
    let user_logged_in = true;
    let sign_up_shown = false;

    let func4 = () => {
        document.querySelectorAll(".remove").forEach(el => {
            el.addEventListener("click", (e) => {
                console.log("removing");
                el.innerText = "Removing...";
                chrome.storage.sync.get("users", (data)=>{
                    if(data.users.length){
                        chrome.runtime.sendMessage({type : "remove_item", item_id : el.dataset.id, userId : data.users[0].id}, (response)=>{
                            if(response.removed){
                                starting();
                            }
                            else{
                                //code for handeling errors
                            }
                        })
                    }
                })
                
            })
        })
    }

    let get_user_data_from_server = async (data) => {
        console.log(data);
        let obj = {
            userId: data.users[0].id
        }

        let da = await fetch(`${baseURL}/getdata`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: { "Content-type": "application/json" }
        });
        
        let item_data = await da.json();

        if (item_data.data.length) {
            let selected_item_html = "<ul style = 'list-style : none;'>"
            item_data.data.forEach(item => {
                selected_item_html += `<br><br><li class = "list"><a href = "${item.url}" target = "_blank" class = "linking">${item.name}</a><a class = "remove" data-id = ${item._id}>Remove</a><br><ul><li class = "price">current price : ${item.currentPrice} INR</li><br><li class= "threshprice">threshold Price : ${item.thresholdPrice} INR</li></ul></li><hr class = "break">`;
            })
            selected_item_html += "</ul><br><br>";
            box.innerHTML = selected_item_html;
            func4();
        }
        else {
            box.innerHTML = "<p class = 'nothing_to_track'>Nothing to track!</p>";
        }

    }

    let disable_buttons = () => {
        home_btn.disabled = true;
        search_btn.disabled = true;
        home_btn.classList.add("home-dim");
        search_btn.classList.add("search-dim");
    }

    let enable_buttons = () => {
        home_btn.classList.remove("home-dim");
        search_btn.classList.remove("search-dim");
        home_btn.disabled = false;
        search_btn.disabled = false;
        user_logged_in = true;
        document.querySelector("#acc").src = "logout.png";
    }

    let set_log_in_html = (obj) => {
        let login_html = ' <div class="left"><h1>Log in</h1><form class = "form"><input type="email" id="email" placeholder="E-mail" /><div class = "emailError errors"></div><input type="password" id="password" placeholder="Password" /><div class = "passwordError errors"></div><input type = "submit" class = "submit login" id = "login" value = "Login"><br><input type = "submit" class = "to_signup submit" id = "to_signup" value = "new user ? sign up"></form></div>'
        box.innerHTML = login_html;
        disable_buttons();
    }

    let set_sign_up_html = () => {
        let signup_html = ' <div class="left"><h1>Sign Up</h1><form class = "form"><input type="text" id="username" placeholder="Username" /><input type="email" id="email" placeholder="E-mail" /><div class = "emailError errors"></div><input type="password" id="password" placeholder="Password" /><div class = "passwordError errors"></div><input type = "submit" class = "signup_submit submit" id = "signup_submit" value = "signup"><br><input type = "submit" class = "to_login submit" id = "to_login" value = "Have an account ? Login"></form></div>'
        box.innerHTML = signup_html;
        disable_buttons();
    }

    let display_errors = (data) => {
        document.querySelector(".emailError").innerHTML = data.user_login_errors[0].email;
        document.querySelector(".passwordError").innerHTML = data.user_login_errors[1].password;
    }

    let starting = () => {
        chrome.storage.sync.get("users", (data) => {
            if (data.users.length == 0) {
                document.querySelector("#acc").src = "enter.png";
                user_logged_in = false;
                set_log_in_html(data);
                func1();
            }
            else {
                user_logged_in = true;
                box.innerHTML = '<div class="container"><div class="dot dot1"></div><div class="dot dot2"></div><div class="dot dot3"></div></div>'
                get_user_data_from_server(data);
            }
        });
    }


    starting();


    let func1 = () => {
        if (!user_logged_in && !sign_up_shown) {
            let login_btn = document.querySelector("#login");
            login_btn.addEventListener("click", async (e) => {
                e.preventDefault();
                const email = document.querySelector(".form").email.value;
                const password = document.querySelector(".form").password.value;
                chrome.runtime.sendMessage({ type: "log_sign", email, password }, (response) => {
                    if (response.user_logged_in) {
                        chrome.storage.sync.get("users", (data) => {
                            box.innerHTML = '<div class="container"><div class="dot dot1"></div><div class="dot dot2"></div><div class="dot dot3"></div></div>'
                            get_user_data_from_server(data);
                            enable_buttons();
                        })
                    }
                    else {
                        chrome.storage.sync.get("user_login_errors", (data) => {
                            if (data.user_login_errors.length) {
                                document.querySelector("#login").innerHTML = "Login"
                                display_errors(data);
                            }
                        })
                    }
                })
            })

            document.querySelector("#to_signup").addEventListener("click", (e) => {
                e.preventDefault();
                console.log("setting signup")
                set_sign_up_html();

                sign_up_shown = true;

                func2();
            })
        }
    }

    let func2 = () => {
        if (!user_logged_in && sign_up_shown) {
            document.querySelector("#to_login").addEventListener("click", (e) => {
                e.preventDefault();
                set_log_in_html();
                sign_up_shown = false;
                func1();
            })

            document.querySelector("#signup_submit").addEventListener("click", async (e) => {
                e.preventDefault();
                const username = document.querySelector(".form").username.value;
                const email = document.querySelector(".form").email.value;
                const password = document.querySelector(".form").password.value;
                chrome.runtime.sendMessage({ type: "log_sign", username, email, password }, (response) => {
                    if (response.user_logged_in) {
                        box.innerHTML = "<p class = 'nothing_to_track'>Nothing to track!</p>";
                        enable_buttons();
                    }
                    else {
                        chrome.storage.sync.get("user_login_errors", (data) => {
                            if (data.user_login_errors.length) {
                                display_errors(data);
                            }
                        })
                    }

                })

            })
        }
    }



    home_btn.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.storage.sync.get("users", (data) => {
            box.innerHTML = '<div class="container"><div class="dot dot1"></div><div class="dot dot2"></div><div class="dot dot3"></div></div>'
            get_user_data_from_server(data);
        })
    })

    account_btn.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.storage.sync.set({ users: [] });
        starting();
    })

    search_btn.addEventListener("click", (e) => {
        e.preventDefault();
        let url = "https://www.amazon.in/"
        window.open(url, '_blank').focus();
    })

    cross.addEventListener("click", (e)=>{
        e.preventDefault();
        window.close();
    })

}
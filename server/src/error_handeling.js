let handle_err = (err) => {
    const errors = [{ email: "" }, { password: "" }];
    const err_code = err.code;
    const err_msg = err.message;
    if (err_code === 11000) {
        errors[0].email = "This email is not available";
        return errors;
    }
    if (err_msg == 'emailError') {
        errors[0].email = "This email is not registered";

    }
    if (err_msg == 'passwordError') {

        errors[1].password = "Incorrect Password";
    }
    if (err_msg.includes("user validation failed")) {
        const obj = Object.values(err.errors)
        obj.forEach(({ properties }) => {
            if (properties.path == "email") {
                errors[0].email = properties.message;
            }
            else {
                errors[1].password = properties.message;
            }

        })
    }
    return errors;
}


module.exports = { handle_err };

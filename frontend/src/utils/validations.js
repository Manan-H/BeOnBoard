

var validateOne = (value, type) => {
    if(type === "name") {
        return validateName(value);
    }
    if(type === "email") {
        return validateEmail(value); 
    }
    if(type === "phoneNumber") {
        return phonenumber(value)
    }
    if(Array.isArray(value)) {
        return value.length > 0;
    } 
    if(value === null || value === undefined) {
        return false
    }  
    switch(typeof value) {
        case "string":
            return value.trim().length > 1;
        case "object":
            return Object.getOwnPropertyNames(value).length !== 0;
        default:
            return true
    }
  
}

const validateAll = (fields, info) => {
    let isValid = true;

    fields.forEach(field => {
        if(field.isRequired ) {
            const value = info[field.name];
            if(!validateOne(value,field.type)) {
                isValid = false;
            }
        }
    })

    return isValid;
}


export {validateOne, validateAll}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function validateName(name) {
    var re = /^[A-Za-z\-]{2,}$/;
    return re.test(String(name).toLowerCase());
    
}
function phonenumber(inputtxt) {
    var phoneno = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    return phoneno.test(inputtxt);
  }
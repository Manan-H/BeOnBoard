import {notification} from "antd";
const { REACT_APP_API_ROOT, REACT_APP_VERSION } = process.env;

export function request(url, method, body) {
    const fetchData = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        mode: "cors",
        credentials: 'include',
        method
    };

    if (!(method === 'GET' || method === 'DELETE')) {
        fetchData.body = JSON.stringify(body) || ""
    }


    return new Promise((resolve, reject) => {
        fetch(`${REACT_APP_API_ROOT}/api/${REACT_APP_VERSION}/${url}`, fetchData)
            .then(async res => {
                const parsedBody = await res.json();

                if (res.ok) return resolve(parsedBody);

                return reject({
                    message: parsedBody.msg
                })
            })
            .catch(err => {
                notification.error({
                    message: 'Oops! Something went wrong!',
                    description: err.message,
                });
                reject({
                    message: err.message
                });
            })
    });
}

export function doGet(url) {
    return request(url, "GET");
}
export function doPost(url, body) {
    return request(url, "POST", body);
}
export function doPut(url, body) {
    return request(url, "PUT", body);
}
export function doPatch(url, body) {
    return request(url, "PATCH", body);
}
export function doDelete(url, body) {
    return request(url, "DELETE", body);
}
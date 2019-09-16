const { REACT_APP_API_ROOT, REACT_APP_VERSION } = process.env
const URL = `${REACT_APP_API_ROOT}/api/${REACT_APP_VERSION}/users/verify-url`

const verifyUrl = url => {

  return fetch(URL, {
    method: 'post',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },  
    body: JSON.stringify({ url })
    
  });
}

export default verifyUrl;
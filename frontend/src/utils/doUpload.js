const { REACT_APP_API_ROOT, REACT_APP_VERSION } = process.env;
const BASE = `${REACT_APP_API_ROOT}/api/${REACT_APP_VERSION}`;

const doUpload = (endpoint, body, method) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE}/${endpoint}`, {
      method: method || 'post',
      credentials: 'include',
      body
    })
      .then( res => {
        if (res.ok) {
          resolve(res.json());
          return;
        }
        res.json().then(reject);
        
      })
      .catch( err => reject(err))
  }) 
}

export default doUpload;
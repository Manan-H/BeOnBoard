import { googleAuth } from '../apiEndpoints/authEndpoints';
import { doGet } from '../request';
import { notification } from 'antd';

export default () => {
    doGet(googleAuth)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            notification.error({
                message: 'Oops! Something went wrong!',
                description: err.message,
            });
        });
}

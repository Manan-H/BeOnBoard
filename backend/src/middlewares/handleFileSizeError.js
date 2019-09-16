import { MAX_FILE_SIZE } from '../config/fileUpload';

const handleFileSizeError = (err, req, res, next) => {

  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).send({ 
      message: `Upload exceeds size limit: ${(MAX_FILE_SIZE/(1024*1024)).toFixed(2)}mb` 
    });
    return;
  }
}

export default handleFileSizeError;
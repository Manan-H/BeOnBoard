import fs from 'fs';

const removeFile = path => {
  fs.access(path, null, err => {
    if (err) return;
    fs.unlink(path, err => {
      if(err) {
        console.log(err);
        return;
      }
      console.log('temporary file successfully removed');
    });
  });
}

export default removeFile;
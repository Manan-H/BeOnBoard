import cloudinary from 'cloudinary';
import removeFile from '../helper/removeFile';

const cloudinaryUpload = async (req, res, next) => {
  const files = [].concat(req.files || []).concat(req.file || []);
  req.failedUploads = [];

  req.uploadedFiles = await files.reduce( async (uploadedFiles, file) => {
    const resolved = await uploadedFiles; 
    let result;
    try {
      result = await cloudinary.v2.uploader.upload(file.path, { 
        resource_type: 'auto',
        public_id: file.originalname
      });
    } catch(err) {
      console.log(err);
      req.failedUploads.push(file.id);
    } finally {
      removeFile(file.path);
    }

    if (!result) {
      return Promise.resolve(resolved);
    }

    file.cloudinary = result;
    return Promise.resolve([...resolved, file]);
  }, Promise.resolve([]));

  next();
}

export default cloudinaryUpload;
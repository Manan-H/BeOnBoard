const filterImage = (req, file, cb) => {
  req.filterErrors = req.filterErrors || [];

  const isImage = file.mimetype.split('/')[0] === 'image';

  if (!isImage) {
    req.filterErrors.push(`${file.name} is not an image`);
    cb(null, false);
  }

  cb(null, true);

}

export default filterImage;
import cloudinary from 'cloudinary';
import UserModel from '../models/userModel';
import removeFile from '../helper/removeFile';


class homeController {
  uploadImage(req, res) {
    const file = req.file;
    const isImage = file.mimetype.split('/')[0] === 'image';

    if (!isImage) {
      res.status(400).send({
        message: 'wrong file type',
      });
      removeFile(file.path);
      return;
    }

    cloudinary.v2.uploader.upload(file.path, function(err, result) {
      if (err) {
        res.status(400).send({
          message: err,
        });
        return;
      }

      res.status(200).send({
        url: result.url,
      });
  
      removeFile(file.path);
    })
   
  }

  uploadProfileImage(req, res) {
  
    let file = req.file;
    cloudinary.v2.uploader.upload(file.path, function(err, result) {
      if (err) {
        res.status(400).send({
          message: err,
        });
      }

      if (req.params.id) {
        UserModel.updateOne(
          {
            _id: req.params.id,
          },
          {
            $set: { profPic: result.url },
          }
        ).then(user => {
          res.status(200).send({
            url: result.url,
          });
        })
        .finally(()=> removeFile(file.path));
      }
    });
  }
}

export default new homeController();

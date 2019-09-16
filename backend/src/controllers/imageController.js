import ImageModel from '../models/imageModel';


class ImageController {
  postImages(req, res) {

    const { uploadedFiles, failedUploads } = req;

    if (uploadedFiles.length === 0) {
      res.status(400).json({
        message: 'Image upload failed',
        failedUploads
      });
      return;
    }

    const ids = [].concat(req.body.id);
    const captions = [].concat(req.body.caption);

    const newImages = uploadedFiles.map( (file,i) => {
      return {
        cloudinaryId: file.cloudinary['public_id'],
        createdAt: file.cloudinary['created_at'],
        src: file.cloudinary['secure_url'],
        _id: ids[i],
        caption: captions[i],
        uploader: req.user._id,
        likes:[]        
      };
    });
 

    ImageModel.create(newImages)
      .then( createdImages => {
        res.json({
          createdImages,
          failedUploads
        })
      })
      .catch( err => {
        console.log('failed write images to db');
        console.log(err);
        res.status(500).json({
          message: 'Image upload failed'
        })
      });
  }
  

  getImages(req, res) {
   
    ImageModel.find()
      .populate('uploader', 'name surname' )
      .then( allImages => res.json(allImages) )
      .catch( err => {
        console.log(err);
        res.sendStatus(404); 
      })
  
    }

    deleteImages(req, res) {

      const ids = req.body;


      ImageModel.deleteMany({ _id: { $in: ids } })
        .then( ()=> res.status(200).json({
          message: 'Images deleted successfully'
        }))
        .catch( err => {
          console.log(err);
          res.status(400).json({
            message: 'Failed to delete images'
          });
        })

    }

  }


export default new ImageController();

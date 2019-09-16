import DocumentModel from '../models/documentModel';
import removeFromCloudinary from '../helper/removeFromCloudinary';

class DocumentController {
  postDocuments(req, res) {

    const { uploadedFiles, failedUploads } = req;
    const info = JSON.parse(req.body.info);
    
    if (uploadedFiles.length === 0) {
      res.status(400).json({
        message: 'Document upload failed',
        failedUploads
      });
      return;
    }

    const newDocuments = uploadedFiles.map( file => {
      return {
        cloudinaryId: file.cloudinary.public_id,
        createdAt: file.cloudinary.created_at,
        src: file.cloudinary.secure_url,
        _id: file.fieldname,
        title: info[file.fieldname].title || 'Document',
        description: info[file.fieldname].description,
        size: file.size,
        uploader: req.user._id
      };
    });
 
    DocumentModel.create(newDocuments)
      .then( createdDocuments => {
        res.json({
          createdDocuments,
          failedUploads
        })
      })
      .catch( err => {
        console.log('failed write documents to db');
        console.log(err);
        res.status(500).json({
          message: 'Document upload failed'
        })
      });
  }
  

  getDocuments(req, res) {
   
    DocumentModel.find()
      .populate('uploader', 'name surname' )
      .then( allDocuments => res.json(allDocuments) )
      .catch( err => {
        console.log(err);
        res.sendStatus(404); 
      })

  }

  deleteDocuments(req, res) {
  
    const id = req.params.id;
    const userType = req.user.userType;
    
    if (userType !== 1) {
      res.status(401).json({
        message: 'User not authorized to perform this action'
      })
      return;
    }

    DocumentModel.findOneAndDelete({ _id: id })
      .then( deleted => {
         res.json({
           message: `${deleted.title} successfully removed`
         });
         removeFromCloudinary(deleted.cloudinaryId);
      })
      .catch( err => {
        console.log(err);
        res.sendStatus(404); 
      })
  
    }
  }


export default new DocumentController();

import cloudinary from 'cloudinary';

const removeFromCloudinary = public_id => {
  cloudinary.v2.api.delete_resources([public_id])
    .then( ()=>{
      console.log('file removed from Cloudinary')
    })
    .catch( err => {
      console.log('failed to remove file from Cloudinary');
      console.log(err);
    })
}

export default removeFromCloudinary;
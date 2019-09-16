const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const imageSchema = new Schema({
    _id: String,
    src: String,
    uploader: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    cloudinaryId: String,
    createdAt: Date,
    caption: String,
    likes: []   
});

export default mongoose.model('images', imageSchema);

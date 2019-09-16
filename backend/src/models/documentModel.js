const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const documentSchema = new Schema({
    _id: String,
    src: String,
    uploader: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    cloudinaryId: String,
    createdAt: Date,
    title: String,
    description: String,
    size: Number
});

export default mongoose.model('documents', documentSchema);

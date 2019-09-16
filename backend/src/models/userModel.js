const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    surname: String,
    shortInfo: String,
    email: String,
    corpEmail: String,
    userType: Number,
    phoneNumber: String,
    birthday: Date,
    position: String,
    education: String,
    professionalSkills: [],
    photos: [],
    profPic: String,
    hobbies: [],
    experience: Number,
    notifications: [],
    firstLogin: Boolean,
    social: [],
    quizzes:{},
    hasUnseenNotifications: Boolean
});

export default mongoose.model('users', userSchema);

export const ObjectId = mongoose.Types.ObjectId;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizResults = new Schema([{
    quiz: {
        type: Schema.Types.ObjectId,
        ref: "quizzes"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    date: Date,
    score: Number,
    percent: Number,
    status: String

}]);

export default mongoose.model('quizResults', quizResults);

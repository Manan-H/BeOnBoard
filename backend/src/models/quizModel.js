const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// questions sctructure
// {questions:[
    // {
    //     "head":{
    //         "title":"QUESTION EDITED @!@ 1",
    //         "questionType":"image",
    //         "content":"linkkk"
    //     },
//      "options": [ { id: 0, text: '' }, ... ],
//      "corrrectOptions": [2,3]
    //     }		
// ]}

const quizSchema = new Schema({
    title: String,
    type: String,
    description: String,
    questions: [],
    isActive: Boolean,
    result: {}
});
export default mongoose.model('quizzes', quizSchema);


import quizModel from "../models/quizModel"
import quizResultsModel from "../models/quizResultsModel"


class QuizController{ 
    analyzeQuiz(req, res) {
        const { quizId, answers, time } = req.body;
        const { _id } = req.user;
        let score = 0;
        let status = "failed";
        let percent;
        let response = {};
        
        quizModel
            .findOne({
                _id: quizId
            })
            .then(quiz => {
                //analyze
                const { questions } = quiz;
                for(let key in answers) {
                    let question = questions.find(elem => {
                        return elem.id === key;
                    })
                    if( (question.head.questionType === "text" && checkAnswers(question.correctOptions,answers[key])) ||
                        (question.head.questionType === "coord" && checkCoordAnswers(question.correctRange,answers[key]))) {
                            score++;
                    }                                     
                }

                percent = Math.round(score/questions.length*100);
                
                if(percent >= 70) {
                    status = "passed";
                }   

                return {
                    score,
                    status,
                    percent,
                    quiz:quizId,
                    user: _id,
                    date: time
                }
            })
            .then(result => {
                response = result;
                const quizResult = new quizResultsModel(result)
                return quizResult.save(result)                         
            })
            .then(result => {
                //send
                res.status(200).send(response)
            })
            .catch(err => {
                console.log(err)
                res.status(400).send(err)
            })
    }
    

    getRecordsForQuiz(req , res) {
        const { quizId } = req.params;
        quizResultsModel
            .find({
                quiz: quizId
            })       
            .populate("user", "name surname profPic position")
            .then(results=> {
                const leaderBoard = makeLeaderBoard(results)
                res.status(200).send(leaderBoard);
            })
            .catch(err => {
                res.status(400).send(err);
            })

    }


    getHistory(req , res) {
        quizResultsModel
            .find({})
            .sort({
                date: -1
            })
            .limit(30)
            .populate("quiz", "title")
            .populate("user", "name surname profPic")
            .then(history => {
                res.status(200).send(history);
            })
            .catch(err => {
                res.status(400).send(err);
            })
    }

}

const checkCoordAnswers = (correctRange, range ) => {
    let result = true
    Object.keys(range).forEach(key => {
        if(( correctRange[key].start > range[key] ) || (range[key] > correctRange[key].end )  ) {
            result = false;
        }
    })
    return result;
}

const checkAnswers = (arr1,arr2) => {
    if(arr1.length !== arr2.length) {
        return false;
    }
    for(let i = 0; i < arr2.length; i++) {
        if(arr1.indexOf(arr2[i])  === -1) {
            return false
        }
    }
    
    return true;
}

const makeLeaderBoard = results => {
    // console.log(results)
    const topForUsers = {}
    results.forEach(result => {
        if(!topForUsers[result.user._id] || topForUsers[result.user._id].score <= result.score ) {
            topForUsers[result.user._id] = result
        }
    })
    // console.log(topForUsers)
    //then sort...
    const values = Object.values(topForUsers);
    values.sort((a,b) => b.score - a.score)


    return values;
}
export default new QuizController();
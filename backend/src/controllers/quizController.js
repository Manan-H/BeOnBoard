import quizModel from '../models/quizModel';
import UserModel from '../models/userModel';
import quizResultsModel from "../models/quizResultsModel"

import uniqid from 'uniqid';

class QuizController {
  //quizzes
  createQuiz(req, res) {
    const quiz = new quizModel(req.body);
    quiz.isActive = quiz.isActive ? true : false;
    quizModel.find({}).then(quizzes => {
      if (quizzes.length < 1) {
        quiz.isActive = true;
      }
    });

    quiz
      .save()
      .then(newQuiz => {
        res.status(200).send(newQuiz);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  createPhotoQuiz(req, res) {
    const { uploadedFiles, failedUploads } = req;
    const quiz = JSON.parse(req.body.quiz);


    const cloudinaryUrlsById = uploadedFiles.reduce( (acc, file)=>{
        return {
            ...acc,
            [file.fieldname]: file.cloudinary.secure_url
        }
    }, {});

    const quizWithCloudinaryUrls = {
        ...quiz,
        questions: quiz.questions.map( question => {
            if (question.photo.img) return question;
            return {
                ...question,
                photo: { img: cloudinaryUrlsById[question.photo]}
            }
        })
    };

    if (quiz._id) {
        quizModel.findOneAndUpdate({ _id: quiz._id }, quizWithCloudinaryUrls, { new: true })
            .then( newQuiz => {
                res.status(200).json(newQuiz)
            })
            .catch( err => {
                res.status(400).send(err);
            });
        return;
    }

    quizModel.create(quizWithCloudinaryUrls)
        .then( newQuiz => {
            res.status(200).json(newQuiz)
        })
        .catch( err => {
            res.status(400).send(err);
        });  

  }

  getQuizById(req, res) {
    const { userType } = req.user;
    const { quizId } = req.params;

    const filter = {};
    if (userType === 2) {
      filter['questions.correctOptions'] = false;
    }

    quizModel
      .findOne(
        {
          _id: quizId,
        },
        filter
      )
      .then(quiz => {
        res.status(200).send(quiz);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  getAllQuizzes(req, res) {
    const { userType, _id } = req.user;
    const condition = {};
    const filter = {};
    let quizzes = []

    if (userType === 2) {
      condition['isActive'] = true;
      filter['questions.correctOptions'] = false;
      filter['isActive'] = false;
    }

    quizModel
      .find(condition, filter)
      .then(res => {
        quizzes = res;
        return quizResultsModel.find({
          user: _id
        })  
      })
      .then(results => {
        fillBestResults(quizzes, results)          
        res.status(200).send(quizzes)
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  deleteQuiz(req, res) {
    const quizId = req.params.quizId;
    let response;

    quizModel
      .deleteOne({
        _id: quizId,
      })
      .then(res => {
        response = res;
        return quizResultsModel
                .deleteMany({
                  quiz: quizId
                })
      })
      .then(() => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  editQuiz(req, res) {
    const quizData = req.body;
    const { quizId } = req.params;

    quizModel
      .updateOne(
        {
          _id: quizId,
        },
        {
          $set: quizData,
        }
      )
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  setActiveQuiz(req, res) {
    const quizId = req.params.quizId;
    const { isActive } = req.body;

    quizModel
      .updateOne(
        {
          _id: quizId,
        },
        {
          $set: {
            isActive,
          },
        }
      )
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  //questions
  getQuestionsByQuizId(req, res) {
    const { quizId } = req.params;
    const { userType } = req.user;
    const condition = {
      _id: quizId,
    };
    const filter = {
      // "questions": true
    };

    if (userType === 2) {
      filter['questions.correctOptions'] = false;
      filter['isActive'] = false;
    }
    quizModel
      .findOne(condition, filter)
      .then(questions => {
        res.status(200).send(questions);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }
  createQuestion(req, res) {
    const question = req.body;
    const { quizId } = req.params;
    question.id = uniqid();
    quizModel
      .updateOne(
        {
          _id: quizId,
        },
        {
          $push: {
            questions: question,
          },
        }
      )
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  editQuestion(req, res) {
    const question = req.body;
    const { quizId, questionId } = req.params;

    quizModel
      .updateOne(
        {
          _id: quizId,
          'questions._id': questionId,
        },
        {
          $set: {
            'questions.$': { ...question, _id: questionId },
          },
        }
      )
      .then(quiz => {
        res.status(200).send(quiz);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  deleteQuestion(req, res) {
    const { quizId, questionId } = req.params;

    quizModel
      .updateOne(
        {
          _id: quizId,
          'questions._id': questionId,
        },
        {
          $pull: {
            questions: {
              _id: questionId,
            },
          },
        }
      )
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }
}



const fillBestResults = (quizzes, results) => {
  quizzes.forEach( quiz => {
      let topResult = fillBestResult(quiz,results);

      quiz.result = topResult;
  }) 
  return quizzes;
}

const fillBestResult = (quiz, results) => {
  const resultsByQuizId = results.filter(result => result.quiz.toString() === quiz._id.toString() );
  if(resultsByQuizId.length < 1) {
    return null
  }
  const topResult = resultsByQuizId.reduce((maxRes,result) =>{
    if(result.score > maxRes.score ) {
      return result
    } else {
      return maxRes
    }        
  }, resultsByQuizId[0]);
  return topResult
}

export default new QuizController();

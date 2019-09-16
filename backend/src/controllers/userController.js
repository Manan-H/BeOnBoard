require('dotenv').config();
import UserModel, { ObjectId } from '../models/userModel';
import quizResultsModel from "../models/quizResultsModel";
import storeNotificationInDb from '../helper/storeNotificationInDb';
import notificationTypes, {
  sortNotifications,
} from '../constants/notificationTypes';
import sendGrid from '../services/sendGrid';
import request from 'request';
const { NOTIFICATIONS_LIMIT } = process.env;

class UserController {
  createUser(req, res) {
    const userData = {
      ...req.body,
      firstLogin: true,
    };
    const emailOptions = {
      to: userData.email,
      subject: 'BeOnBoard',
      text:
        'BeOnBoard is a tool which helps new team members learn about other employees, find common interests with each other and learn about the internal rules and regulations of the company.',
      html:
        '<a href="https://be-on-board-test.herokuapp.com/login">Getting Started!</a>',
    };
    const user = new UserModel(userData);
    let newUserData;
    user
      .save()
      .then(newUser => {
        newUserData = newUser;
        return sendGrid.sendMail(emailOptions);
      })
      .then(() => {
        return storeNotificationInDb(
          notificationTypes.setUserInfo(newUserData, 'NEW_USER'),
          newUserData._id
        );
      })
      .then(() => {
        res.status(200).send(newUserData);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  editUserProfile(req, res) {
    const userData = req.body;
    let userId = null;
    let changedByAdmin = false;

    if (req.params.userId) {
      userId = req.params.userId;
      changedByAdmin = true;
      userData.changedByAdmin = changedByAdmin;
    } else {
      userId = req.user._id;
    }

    UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: userData,
      }
    )
      .then(() => {
        const sendToUser = storeNotificationInDb(
            notificationTypes.setUserInfo(userData, 'PROFILE_EDIT'),
            userId,
            changedByAdmin
        );

        const sendToAdmins = storeNotificationInDb(
            notificationTypes.setUserInfo(userData, 'PROFILE_EDIT', true),
            userId,
            false
        );

        let sendNotifPromiseArray = [sendToUser];
        if (changedByAdmin) {
          sendNotifPromiseArray.push(sendToAdmins);
        }

        return Promise.all(sendNotifPromiseArray);
      })
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  deleteUser(req, res) {
    const userId = req.params.userId;
    let response;
    UserModel.deleteOne({
      _id: userId,
    })
      .then(res => {
        response = res;
        return quizResultsModel
                .deleteMany({
                  user: userId
                })
      })
      .then(() => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  takeQuiz(req, res) {
    const userId = req.user._id;
    return storeNotificationInDb(
      notificationTypes.setUserInfo(req.user, 'QUIZ_TAKEN'),
      userId
    )
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  markNotificationsAsSeen(req, res) {
    const userId = req.user._id;
    const notifId = req.body.notifId;
    const condition = {
      _id: userId,
    };
    const operation = {
      $set: {
        'hasUnseenNotifications' : false
      }
    };

    notifId && (condition['notifications.id'] = notifId);
    notifId && (operation['notifications.$.seen'] = true);

    UserModel
      .update(condition, operation)
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  getNotificationsById(req, res) {
    const userId = req.user._id;
    UserModel.aggregate([
      {
        $match: { _id: ObjectId(userId) },
      },
      {
        $project: {
          notifications: {
            $slice: ['$notifications', -parseInt(NOTIFICATIONS_LIMIT)],
          },
          _id: 0,
        },
      },
      {
        $unwind: '$notifications',
      },
      {
        $sort: { 'notifications.createdAt': -1 },
      },
      { $replaceRoot: { newRoot: '$notifications' } },
    ])
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  getUserById(req, res) {
    UserModel.find({
      _id: req.params.userId,
    })
      .then(response => {
        console.log(response);
        if(!response.length) {
          res.status(404).send({
            message: 'User not found'
          });
          return;
        }
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  getUserProfile(req, res) {
    const userId = req.user._id;
    UserModel
      .findOne({_id: userId})
      .slice('notifications', -parseInt(NOTIFICATIONS_LIMIT))
      .then(response => {
        response.notifications = sortNotifications(response.notifications);
        res.status(200).send(response);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  getUsers(req, res) {
    const userId = req.user._id;
    const options = {
      _id: {
        $ne: userId,
      },
    };

    UserModel.find(options)
      .then(response => {
        res.status(200).send({
          users: response,
        });
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  isEmailUnique(req, res) {
    UserModel.findOne({ email: req.params.email })
      .then(response => {
        if (response) {
          res.status(200).send({
            isUnique: false,
            message: 'The provided email already exists',
          });
        } else {
          res.status(200).send({
            isUnique: true,
            message: '',
          });
        }
      })
      .catch(err => {
        res.status(400).send(err);
      });
  }

  verifyUrl(req, res) {

    let { url } = req.body;
    
    if (!url) {
      res.sendStatus(400);
    }

    if (!url.substring(0,8).match(/https?:\/\//)) {
      url = 'https://' + url;
    }
    console.log(`checking link: ${url}`);
    request.head(url, err => {
      if (err) {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(200);
    });
  }

  setPhotos(req, res) {
    const { uploadedFiles, failedUploads } = req;
    const oldUrls = [].concat(req.body.oldPhotos || []);   

    const newUrls = uploadedFiles.map( file => file.cloudinary.secure_url);
   
    UserModel.findByIdAndUpdate(req.user._id , { $set: { photos: [ ...oldUrls, ...newUrls ]}}, { new: true })
      .then( user => res.json(user.photos))
      .catch( err => {
        console.log(err);
        res.status(500).json({
          message: 'Upload failed'
        });
    })         
      

  }


}

export default new UserController();

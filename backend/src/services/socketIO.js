import notificationTypes from '../constants/notificationTypes';
import redis from 'redis';
import url from 'url';
import socketIO from 'socket.io';
import sessionConfigs from '../config/passportIOConfigs';

const redisURL = url.parse(process.env.REDIS_URL);
const client = redis.createClient(redisURL.port, redisURL.hostname, {
  no_ready_check: true,
});
client.auth(redisURL.auth.split(':')[1]);

class SocketIO {
  constructor(server) {
    this.io = socketIO(server);
    this.io.use((socket, next) => {
      sessionConfigs(socket.request, {}, next);
    });
    this.io.use((socket, next) => {
      console.log('authenticated user --->', socket.request.session.passport);
      const user = socket.request.session.passport
        ? socket.request.session.passport.user
        : null;
      if (user) {
        next();
      } else {
        next(new Error('Not authenticated'));
      }
    });
    this.initSocketIO = this.initSocketIO.bind(this);
  }

  initSocketIO() {
    this.io.on('connection', socket => {
      // store socketId, userId and useType in Redis

      // !!! Don't remove
      // client.flushdb( function (err, succeeded) {
      //   console.log(succeeded); // will be true if successfull
      // });

      socket.on('user-data', userData => {
        if (userData.id) {
          client.set(socket.id, JSON.stringify(userData));
        }
      });

      console.log('A user connected');
      socket.on('disconnect', () => {
        console.log('User disconnected');
        client.del(socket.id);
      });

      client.on('error', err => {
        console.log('Error ' + err);
      });

      socket.on('new-user-registered', userData => {
        console.log('new-user-registered');
        const notification = notificationTypes.setUserInfo(
          userData,
          'NEW_USER'
        );
        this.sendNotificationToAll(socket, notification);
      });

      socket.on('user-profile-edited', options => {
        console.log('user-profile-edited');
        const notification = notificationTypes.setUserInfo(
          options,
          'PROFILE_EDIT',
          options.changedByAdmin
        );
        this.sendNotificationToAdmins(socket, notification, options.userId);
        options.changedByAdmin &&
          this.sendNotificationToSpecUser(socket, notification, options.userId);
      });

      socket.on('new-quiz-taken', () => {
        console.log('new-quiz-taken');
        this.sendNotificationToAdmins(socket, notificationTypes.QUIZ_TAKEN);
      });
    });
  }

  sendNotificationToAll(socket, notification) {
    socket.broadcast.emit('new-notification', notification);
  }

  sendNotificationToAdmins(socket, notification, userId) {
    client.keys('*', (err, keys) => {
      keys.forEach(socketId => {
        client.get(socketId, (err, user) => {
          const userData = JSON.parse(user);
          if (userData.userType == 1 && userData.id != userId) {
            socket.broadcast
              .to(socketId)
              .emit('new-notification', notification);
          }
        });
      });
    });
  }

  sendNotificationToSpecUser(socket, notification, userId) {
    client.keys('*', (err, keys) => {
      keys.forEach(socketId => {
        client.get(socketId, (err, user) => {
          const userData = JSON.parse(user);
          if (userData.id == userId) {
            socket.broadcast
              .to(socketId)
              .emit('new-notification', notification);
          }
        });
      });
    });
  }
}

export default SocketIO;

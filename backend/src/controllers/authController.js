require('dotenv').config();

class authController {
  redirectUser(req, res) {
    console.log('LOGGED IN USER IS:  ' + req.user);
    req.session.save(() => {
      console.log('session was saved');
      res.redirect('https://be-on-board-test.herokuapp.com/');
    });
  }

  logoutUser(req, res) {
    req.logout();
    const appLoginUrl = 'https://be-on-board-test.herokuapp.com/login';
    console.log('user logged out');
    res.redirect(appLoginUrl);
  }
}

export default new authController();

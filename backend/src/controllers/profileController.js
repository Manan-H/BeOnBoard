class profileController {
  openProfile(req, res) {
    res.redirect('/profile');
  }
}

export default new profileController();

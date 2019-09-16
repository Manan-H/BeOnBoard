import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import LoginPage from "./LoginPage";
import AddUser from "./admin/AddUser";
import UserList from "./UserList";
import MyProfilePage from "./MyProfilePage";
import ProfilePageById from "./ProfilePageById";
import PrivateRoute from "./PrivateRoute";
import EditMySelf from "./editPages/EditMySelf";
import QuizList from "./Quiz/QuizList";
import QuizAdminMenu from "./Quiz/QuizAdminMenu";
import EditUser from "./editPages/EditUser";
import EditQuiz from "./Quiz/EditQuiz";
import Gallery from "./Gallery";
import QuizLeaderBoard from "./Quiz/QuizLeaderBoard";
import TakeQuiz from "./Quiz/TakeQuiz";
import Documents from "./Documents";
import QuizHistory from "./Quiz/QuizHistory";

const Routes = props => {
  const userInfo = useSelector(state => state.currentUser.userInfo);
  return (
    <Switch>
      {/* Root (handles first login logic and user type redirect) */}
      <Route
        exact
        path="/"
        render={() => {
          if (userInfo.firstLogin) {
            return <Redirect to="/complete-registration" />;
          }
          switch (userInfo.userType) {
            case 1:
            case 2:
              return <Redirect to="/my-profile" />;
            default:
              return <Redirect to="/login" />;
          }
        }}
      />
      {/*Login Page */}
      <PrivateRoute type={0} exact path="/login" component={LoginPage} />
      {/*First Login */}
      <PrivateRoute
        type={[1, 2]}
        exact
        path="/complete-registration"
        component={EditMySelf}
      />
      {/* User or Admin Routes */}
      <PrivateRoute
        type={[1, 2]}
        exact
        path={`/my-profile`}
        component={MyProfilePage}
      />
      <PrivateRoute
        type={[1, 2]}
        path={`/team/profile/:id`}
        component={ProfilePageById}
      />
      <PrivateRoute type={[1, 2]} exact path={`/team`} component={UserList} />
      <PrivateRoute type={[1, 2]} exact path={`/edit`} component={EditMySelf} />
      <PrivateRoute type={[1, 2]} exact path={`/gallery`} component={Gallery} />
      <PrivateRoute
        type={[1, 2]}
        exact
        path={`/leaders-board/:id`}
        component={QuizLeaderBoard}
      />
      <PrivateRoute
        type={[1, 2]}
        exact
        path={`/documents`}
        component={Documents}
      />

      {/* Admin Routes */}
      <PrivateRoute type={1} path={`/create-user`} component={AddUser} />
      <PrivateRoute type={1} path={`/create-quiz`} component={QuizAdminMenu} />
      <PrivateRoute type={1} path={`/quizzes/edit`} component={EditQuiz} />
      <PrivateRoute type={1} path={`/team/edit/:id`} component={EditUser} />
      <PrivateRoute type={1} path={`/quiz-history`} component={QuizHistory} />
      {/*First Login */}
      <PrivateRoute
        type={[1, 2]}
        exact
        path={`/quizzes`}
        component={QuizList}
      />
      <PrivateRoute
        type={[1, 2]}
        exact
        path={`/quizzes/:id`}
        component={TakeQuiz}
      />
      <PrivateRoute
        type={[1, 2]}
        exact
        path="/complete-registration"
        component={EditMySelf}
      />
      {/* User or Admin Routes */}
      <PrivateRoute
        type={[1, 2]}
        exact
        path={`/my-profile`}
        component={MyProfilePage}
      />
      <PrivateRoute
        type={[1, 2]}
        path={`/team/profile/:id`}
        component={ProfilePageById}
      />
      <PrivateRoute type={[1, 2]} exact path={`/team`} component={UserList} />
      <PrivateRoute type={[1, 2]} exact path={`/edit`} component={EditMySelf} />
      {/* Admin Routes */}
      <PrivateRoute type={1} path={`/create-user`} component={AddUser} />
      <PrivateRoute type={1} path={`/team/edit/:id`} component={EditUser} />
      {/* No Routes matched */}
      <PrivateRoute path="" component={<h1>Page Not Found</h1>} />
    </Switch>
  );
};

export default Routes;

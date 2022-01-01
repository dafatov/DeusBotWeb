import {Redirect, Route} from "react-router-dom";

const AuthRoute = ({logged, ...props}) => {
  return (logged
      ? <Route {...props}/>
      : <Redirect to={{pathname: "/auth"}}/>
  );
};

export default AuthRoute;
import {Route, Switch} from "react-router-dom";
import Landing from "../pages/landing/Landing";
import NotFound from "../pages/not_found/NotFound";
import Player from "../pages/player/Player";
import Auth from "../pages/auth/Auth";
import Bar from "../bar/Bar";
import {Stack} from "@mui/material";
import AuthRoute from "../components/AuthRoute";
import {useAuth} from "../security/AuthProvider";

const AppView = () => {
  const [logged] = useAuth();

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
    >
      <Bar/>
      <Switch>
        <Route path="/" component={Landing} exact/>
        <Route path="/auth" component={Auth} exact/>
        <AuthRoute logged={logged} path="/player" component={Player} exact/>
        <Route path="/" component={NotFound}/>
      </Switch>
    </Stack>
  );
};

export default AppView;
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./Login";
import ToDo from "./ToDo";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/todo" component={ToDo} />
        <Route exact path="/" component={LoginPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;

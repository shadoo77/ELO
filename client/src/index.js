import "core-js/stable";
// React
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { CacheProvider } from "rest-hooks";
import * as serviceWorker from "./serviceWorker";
// Services
import { historyService } from "./services/history";
import store from "./store";
// Multi theme material ui
import { ThemeProvider } from "@material-ui/styles";
import { MainTheme } from "./components/shared/Theme";
import CssBaseline from "@material-ui/core/CssBaseline";

// Components
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <CacheProvider>
      <CssBaseline />
      <ThemeProvider theme={MainTheme}>
        {/* <MuiThemeProvider theme={MainTheme}> */}
        <Router history={historyService}>
          <App />
        </Router>
        {/* </MuiThemeProvider> */}
      </ThemeProvider>
    </CacheProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

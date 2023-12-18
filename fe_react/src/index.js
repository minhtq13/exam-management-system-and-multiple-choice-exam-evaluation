import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import GlobalStyles from "../src/components/GlobalStyles";
import App from "./App";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import { HUST_COLOR } from "./utils/constant";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: HUST_COLOR,
        },
      }}
    >
      <GlobalStyles>
        <App />
      </GlobalStyles>
    </ConfigProvider>
  </Provider>
);

reportWebVitals();

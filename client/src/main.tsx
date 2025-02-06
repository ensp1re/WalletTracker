/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { Provider } from "react-redux"
import { store } from "./lib/store/store"

declare global {
  interface Window {
    ethereum?: any
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)


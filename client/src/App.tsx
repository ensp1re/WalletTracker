// import { Web3Provider } from "@/context/Web3Context"
import Dashboard from "./pages/dashboard"
import { ErrorBoundary } from "./components/error-boundary"
import { Layout } from "./components/layout"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import TokenPrice from "./pages/TokenPrice"
import "./index.css"
import { Toaster } from "react-hot-toast";



function App() {


  return (
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
      />
      {/* <Web3Provider> */}
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/price" element={<TokenPrice />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
      {/* </Web3Provider> */}
    </Router>
  )
}

export default App


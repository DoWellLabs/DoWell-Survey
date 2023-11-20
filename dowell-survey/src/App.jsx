import LandingPage from "./Pages/LandingPage";
import { PreviewProvider } from "./Context/PreviewContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreviewPage from './PreviewPage';
import FinalizeSample from './Pages/FinalizeSample';

import StartNewSurvey from "./Layout/StartNewSurvey";

function App() {
  return (
    <>
    <PreviewProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/preview-page" element={<PreviewPage />} />
          <Route path="/finalize-sample" element={<FinalizeSample />} />
          <Route path="/newsurvey" element={<StartNewSurvey />} />


        </Routes>
      </Router>
       </PreviewProvider>
    </>
  );
}

export default App;

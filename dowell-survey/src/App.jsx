import LandingPage from "./Pages/LandingPage";
import { PreviewProvider } from "./Context/PreviewContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreviewPage from "./PreviewPage";
import StartNewSurvey from "./Layout/StartNewSurvey";
import FinalizeSample from "./Pages/FinalizeSample";
import LinkSurvey from "./Pages/LinkSurvey";
import { EmailSms } from "./Pages/EmailSms";
import Edit from "./Pages/EditSurvey";
import Settings from "./Pages/Settings";
import CheckSurvey from "./checkSurvey/CheckSurvey";

function App() {
  return (
    <>
      <PreviewProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/preview-page" element={<PreviewPage />} />
            <Route path="/newsurvey" element={<StartNewSurvey />} />
            <Route path="/finalize-Sample" element={<FinalizeSample />} />
            <Route path="/link-form" element={<LinkSurvey />} />
            <Route path="/email-sms" element={<EmailSms />} />
            <Route path="/list-surveys" element={<Edit />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/check-survey" element={<CheckSurvey />} />
          </Routes>
        </Router>
      </PreviewProvider>
    </>
  );
}

export default App;

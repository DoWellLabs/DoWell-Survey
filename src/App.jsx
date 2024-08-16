// import LandingPage from "./Pages/LandingPage";
// import LandingPageProposed from "./Pages/LandingPageProposed";
// import { PreviewProvider } from "./Context/PreviewContext";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PreviewPage from "./Pages/PreviewPage";
// import StartNewSurvey from "./Pages/StartNewSurvey";
// // import FinalizeSample from "./Pages/FinalizeSample2";
// import FinalizeSample from "./Pages/FinalizeSample";
// import LinkSurvey from "./Pages/LinkSurvey";
// import { EmailSms } from "./Pages/EmailSms";
// import Edit from "./Pages/EditSurvey";
// import EditSurveyTemp from "./Pages/EditSurveyTemp";
// import Settings from "./Pages/Settings";
// import SurveyIframe from "./Pages/SurveyIframe";
// import SurveyIframeAll from "./Pages/SurveyIframeAll";
// import CheckRegion from "./Pages/CheckRegion";
// import TermsCondition from "./Pages/TermsCondition";

// import RedirectToExternalWebsite from "./Pages/RedirectToExternalWebsite";
// import ModalPopUp from "./Pages/ModalPopUp";
// import StartSurvey from "./Pages/StartSurvey";
// // import Search from "./Pages/Npm";
// //import { useLocation } from 'react-router-dom';

// function App() {
//   //const location = useLocation();
//   const queryParams = new URLSearchParams(window.location.search);
//   const session_id = queryParams.get("session_id");
//   console.log(session_id);

//   if (window.location.pathname !== "/DoWell-Survey/") {
//     return (
//       <>
//         <PreviewProvider>
//           <Router basename="/DoWell-Survey">
//             <Routes>
//               <Route path="/survey-iframe" element={<SurveyIframe />} />
//               <Route path="/survey-iframe-all" element={<SurveyIframeAll />} />
//               {/* <Route path="/finalise" element={<FinalizeSample />} /> */}
//               <Route path="*" element={<RedirectToExternalWebsite />} />

//   //             {/* <PreviewProvider> */}
//   //             {/* <Route path="/search" element={<Search />} /> */}
//   //             {/* </PreviewProvider> */}
//   //           </Routes>
//   //         </Router>
//   //       </PreviewProvider>
//   //     </>
//   //   );
//   // }

//   return (
//     <>
//       <PreviewProvider>
//         <Router basename="/DoWell-Survey/">
//           <Routes>
//             <Route path="/" element={<LandingPageProposed />} />
//             <Route path="/email-signup" element={<ModalPopUp />} />

//             <Route path="/landing" element={<LandingPage />} />
//             <Route path="/preview-page" element={<PreviewPage />} />
//             <Route path="/newsurvey" element={<StartNewSurvey />} />
//             <Route path="/finalize-Sample" element={<FinalizeSample />} />
//             <Route path="/link-form" element={<LinkSurvey />} />
//             <Route path="/email-sms" element={<EmailSms />} />
//             <Route path="/start-survey" element={<StartSurvey />} />

//             <Route path="/list-surveys" element={<Edit />} />
//             <Route path="/list-surveys2" element={<EditSurveyTemp />} />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="/terms-conditions" element={<TermsCondition />} />
//             <Route path="/survey-iframe" element={<SurveyIframe />} />
//             <Route path="*" element={<LandingPageProposed />} />
//             {/* <PreviewProvider> */}
//             {/* <Route path="/search" element={<Search />} /> */}
//             {/* </PreviewProvider> */}
//           </Routes>
//         </Router>
//       </PreviewProvider>
//     </>
//   );
// }

// export default App;

import LandingPage from "./Pages/LandingPage";
import LandingPageProposed from "./Pages/LandingPageProposed";
import { PreviewProvider } from "./Context/PreviewContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreviewPage from "./Pages/PreviewPage";
import StartNewSurvey from "./Pages/StartNewSurvey";
// import FinalizeSample from "./Pages/FinalizeSample2";
import FinalizeSample from "./Pages/FinalizeSample";
import LinkSurvey from "./Pages/LinkSurvey";
import { EmailSms } from "./Pages/EmailSms";
import Stop from "./Pages/StopSurvey";
import Edit from "./Pages/EditSurvey";
import EditSurveyTemp from "./Pages/EditSurveyTemp";
import Settings from "./Pages/Settings";
import SurveyIframe from "./Pages/SurveyIframe";
import SurveyIframeAll from "./Pages/SurveyIframeAll";
import CheckRegion from "./Pages/CheckRegion";
import TermsCondition from "./Pages/TermsCondition";

import RedirectToExternalWebsite from "./Pages/RedirectToExternalWebsite";
import ModalPopUp from "./Pages/ModalPopUp";
import StopSurvey from "./Pages/StorySurvey";
// import Search from "./Pages/Npm";
//import { useLocation } from 'react-router-dom';

function App() {
  //const location = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const session_id = queryParams.get("session_id");
  console.log(session_id);

  if (session_id === null || window.location.pathname !== "/DoWell-Survey/")  {
    return (
      <>
        <PreviewProvider>
          <Router basename="/DoWell-Survey">
            <Routes>
              <Route path="/survey-iframe" element={<SurveyIframe />} />
              <Route path="/survey-iframe-all" element={<SurveyIframeAll />} />
              {/* <Route path="/finalise" element={<FinalizeSample />} /> */}
              {/* <Route path="/email-sms" element={<EmailSms />} /> */}

              <Route path="*" element={<RedirectToExternalWebsite />} />
            </Routes>
          </Router>
        </PreviewProvider>
      </>
    );
  }

  return (
    <>
      <Router basename="/DoWell-Survey/">
        <PreviewProvider>
          <Routes>
            <Route path="/" element={<LandingPageProposed />} />
            <Route path="/email-signup" element={<ModalPopUp />} />

            <Route path="/landing" element={<LandingPage />} />
            <Route path="/preview-page" element={<PreviewPage />} />
            <Route path="/newsurvey" element={<StartNewSurvey />} />
            <Route path="/finalize-Sample" element={<FinalizeSample />} />
            <Route path="/link-form" element={<LinkSurvey />} />
            <Route path="/email-sms" element={<EmailSms />} />
            <Route path="/stop-survey" element={<StopSurvey />} />

            <Route path="/list-surveys" element={<Edit />} />
            <Route path="/list-surveys2" element={<EditSurveyTemp />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms-conditions" element={<TermsCondition />} />
            <Route path="/survey-iframe" element={<SurveyIframe />} />
            <Route path="*" element={<LandingPageProposed />} />
          </Routes>
        </PreviewProvider>
      </Router>
    </>
  );
}

export default App;

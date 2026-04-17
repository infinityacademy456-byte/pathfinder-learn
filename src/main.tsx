import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { EnrollmentProvider } from "./contexts/EnrollmentContext";
import { MentorProvider } from "./contexts/MentorContext";

createRoot(document.getElementById("root")!).render(
  <EnrollmentProvider>
    <MentorProvider>
      <App />
    </MentorProvider>
  </EnrollmentProvider>
);

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { EnrollmentProvider } from "./contexts/EnrollmentContext";
import { MentorProvider } from "./contexts/MentorContext";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <EnrollmentProvider>
      <MentorProvider>
        <App />
      </MentorProvider>
    </EnrollmentProvider>
  </AuthProvider>
);

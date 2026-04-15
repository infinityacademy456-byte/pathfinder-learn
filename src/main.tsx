import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { EnrollmentProvider } from "./contexts/EnrollmentContext";

createRoot(document.getElementById("root")!).render(
  <EnrollmentProvider>
    <App />
  </EnrollmentProvider>
);

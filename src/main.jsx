import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const RootComponent = () => {
  return (
    import.meta.env.MODE === "development" ? (
      <StrictMode>
        <App />
      </StrictMode>
    ) : (
      <App />
    )
  );
};

createRoot(document.getElementById("root")).render(<RootComponent />);

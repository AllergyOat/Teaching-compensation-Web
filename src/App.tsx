import "./styles/App.css";
import AppRoute from "./routes/AppRoute";
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <AppRoute />
      <Toaster />
    </>
  );
}

export default App;

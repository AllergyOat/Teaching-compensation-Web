import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h1 className="text-4xl font-light">Hello world</h1>
      <Button>Click me</Button>
    </div>
  );
}

export default App;

import {BrowserRouter} from "react-router-dom";
import ToastHost from "../shared/components/ToastHost";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <ToastHost />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;




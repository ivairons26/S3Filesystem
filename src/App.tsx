import "./App.css";
import ConfigForm from "./config-form/ConfigForm";
import { useConfigContext } from "./context/config.util";
import Home from "./home/Home";

export default function App() {
  const configContext = useConfigContext();
  return (
    <>
      <div>File system</div>
      {configContext.config ? <Home /> : <ConfigForm />}
    </>
  );
}

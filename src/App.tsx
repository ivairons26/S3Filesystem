import "./App.css";
import ConfigForm from "./config-form/ConfigForm";
import { useConfigContext } from "./contexts/config.context";
import FileSystemComponent from "./components/filesystem/FileSystem";
import { S3ServiceProvider } from "./contexts/S3ServiceProvider";

export default function App() {
  const configContext = useConfigContext();
  return (
    <>
      {configContext.config ? (
        <S3ServiceProvider>
          <FileSystemComponent />
        </S3ServiceProvider>
      ) : (
        <ConfigForm />
      )}
    </>
  );
}

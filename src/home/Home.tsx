import { useConfigContext } from "../context/config.context";

export default function Home() {
  const config = useConfigContext();

  if (config.config?.bucketName) {
    // TODO
  }
  return <>TODO add logic here</>;
}

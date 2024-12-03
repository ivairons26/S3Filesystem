import { useConfigContext } from "../context/config.util";

export default function Home() {
  const config = useConfigContext();

  if (config.config?.bucketName) {
    console.log(config);
  }
  return <>TODO add logic here</>;
}

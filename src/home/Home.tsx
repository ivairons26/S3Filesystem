import { useConfigContext } from "../context/config.context";

export default function Home() {
  const config = useConfigContext();

  if (config.config?.bucketName) {
    console.log(config);
  }
  return <>TODO add logic here</>;
}

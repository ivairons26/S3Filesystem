import { Suspense, useState } from "react";
import { useConfigContext } from "../../contexts/config.context";
import S3Provider from "../../providers/s3.provider";
import { Config } from "../../models/config.model";
import "./ConfigForm.css";

export default function ConfigForm() {
  const { writeConfig } = useConfigContext();
  const [isConnecting, setConnecting] = useState<boolean>(false);
  const [bucket, setBucket] = useState<string>("");
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setPassword] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const headBucket = async () => {
    const config: Config = {
      bucketName: "",
      options: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
        region: region,
      },
    };
    S3Provider.setInstance(config);
    const bucketName = bucket;

    try {
      const params = {
        Bucket: bucketName,
      };
      await S3Provider.getInstance().headBucket(params).promise();
      writeConfig({ bucketName, options: config.options });
      setConnecting(false);
    } catch (error) {
      setError("Not able to connect to bucket with these credentials.");
      setConnecting(false);

      setTimeout(() => {
        setError(null);
      }, 3000);
      console.error("Error head bucket:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setConnecting(true);
    headBucket();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connect to your S3 bucket</h2>
      <div className="configInput">
        <label htmlFor="bucket">Bucket:</label>
        <input
          type="text"
          id="bucket"
          value={bucket}
          onChange={(e) => setBucket(e.target.value)}
          required
        />
      </div>

      <div className="configInput">
        <label htmlFor="accessKey">AWS Access Key:</label>
        <input
          type="text"
          id="accessKey"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          required
        />
      </div>

      <div className="configInput">
        <label htmlFor="secretKey">AWS Secret Key:</label>
        <input
          type="text"
          id="secretKey"
          value={secretKey}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="configInput">
        <label htmlFor="region">Region:</label>
        <input
          type="text"
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isConnecting ? (
        <Suspense fallback={<h3>Loading...</h3>}>Loading...</Suspense>
      ) : (
        <button type="submit">Connect</button>
      )}
    </form>
  );
}

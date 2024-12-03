import { useState } from "react";
import AWS from "aws-sdk";
import { useConfigContext } from "../context/config.context";

export default function ConfigForm() {
  const { writeConfig } = useConfigContext();
  const [bucket, setBucket] = useState<string>("");
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setPassword] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const headBucket = async () => {
    const options = {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      region: region,
    };
    const s3 = new AWS.S3(options);
    const bucketName = bucket;

    try {
      const params = {
        Bucket: bucketName,
      };
      await s3.headBucket(params).promise();
      writeConfig({ bucketName, options });
    } catch (error) {
      setError("Not able to connect to bucket with these credentials.");

      setTimeout(() => {
        setError(null);
      }, 3000);
      console.error("Error head bucket:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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

      <button type="submit">Connect</button>
    </form>
  );
}

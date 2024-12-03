import { useState } from "react";
import AWS from "aws-sdk";
import { useConfigContext } from "../context/config.context";

export default function ConfigForm() {
  const { writeConfig } = useConfigContext();
  const [bucket, setBucket] = useState<string>("");
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setPassword] = useState<string>("");
  const [region, setRegion] = useState<string>("");

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
      const data = await s3.headBucket(params).promise();
      console.log("S3 Bucket Objects:", data);
      writeConfig({ bucketName, options });
    } catch (error) {
      console.error("Error listing objects:", error);
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

      <button type="submit">Connect</button>
    </form>
  );
}

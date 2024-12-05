import S3Provider from "../providers/s3.provider";

class S3Service {
  public sayHello() {
    console.log("Hello");
  }

  public listObjects = async (bucketName: string) => {
    try {
      const params = {
        Bucket: bucketName,
      };

      return await S3Provider.getInstance().listObjectsV2(params).promise();
    } catch (error) {
      console.error("Error listing objects:", error);
    }
  };
}

export default S3Service;

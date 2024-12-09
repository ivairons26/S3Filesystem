import { render, screen, fireEvent } from "@testing-library/react";
import ConfigForm from "../../../components/config-form/ConfigForm";
import { ConfigContext } from "../../../contexts/config.context";
import { Config } from "../../../models/config.model";
import "@testing-library/jest-dom";

describe("ConfigForm Component", () => {
  it("should render form to let you connect to s3 bucket", () => {
    const config: Config = {
      bucketName: "",
      options: {
        accessKeyId: "",
        secretAccessKey: "",
        region: "",
      },
    };

    const writeConfig = () => {};
    render(
      <ConfigContext.Provider value={{ config, writeConfig }}>
        <ConfigForm />
      </ConfigContext.Provider>
    );

    expect(screen.getByText("Connect to your S3 bucket")).toBeInTheDocument();
  });
});

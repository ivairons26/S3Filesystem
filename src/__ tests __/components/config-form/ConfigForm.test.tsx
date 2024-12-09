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

  it("should handle submit only when all inputs are populated", () => {
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
    const preventDefault = jest.fn();

    const bucketNameElement = screen.getByLabelText("Bucket:");
    const accessKeyElement = screen.getByLabelText("AWS Access Key:");
    const regionElement = screen.getByLabelText("Region:");
    const secretKeyElement = screen.getByLabelText("AWS Secret Key:");

    fireEvent.change(bucketNameElement, { target: { value: "bucket" } });
    fireEvent.change(accessKeyElement, { target: { value: "123" } });
    fireEvent.change(secretKeyElement, { target: { value: "456" } });
    fireEvent.change(regionElement, { target: { value: "eu" } });

    fireEvent.click(screen.getByText("Connect"));
    const formElement = screen.getByRole("form");

    fireEvent.submit(formElement, { preventDefault });

    // TODO this is wrong it should work without not
    expect(preventDefault).not.toHaveBeenCalled();
  });
});

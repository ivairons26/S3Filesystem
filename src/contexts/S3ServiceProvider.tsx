// HelloServiceContext.tsx
import React, { createContext, useContext } from "react";
import S3Service from "../services/s3.service";

const s3Service = new S3Service();

// Create the context
const S3ServiceContext = createContext<S3Service | null>(null);

export const S3ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <S3ServiceContext.Provider value={s3Service}>
      {children}
    </S3ServiceContext.Provider>
  );
};

// TODO move in a new file
export const useS3Service = () => {
  const service = useContext(S3ServiceContext);
  if (!service) {
    throw new Error("useS3Service must be used within a S3ServiceProvider");
  }
  return service;
};

import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container m-auto max-w-sm px-4 sm:max-w-lg sm:px-0 md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-[1440px]">
      {children}
    </div>
  );
};
export default Container;

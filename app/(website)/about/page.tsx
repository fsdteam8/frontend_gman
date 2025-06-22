import PageHeader from "@/components/sheard/PageHeader";
import React from "react";
import Aboutus from "./_component/Aboutus";

function Page() {
  return (
    <div>
      <PageHeader
        image="/asset/aboutUs.png"
        title="About Us"
        gradientColor="0, 115, 2"
        gradientOpacity={0.5}
      />
      <Aboutus />
    </div>
  );
}

export default Page;
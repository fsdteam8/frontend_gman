import PageHeader from "@/components/sheard/PageHeader";
import React from "react";
import PrivacyPolicy from "./_component/Privacy_Policy";

const page = () => {
  return (
    <div>
      <PageHeader
        image="/asset/privacy.png"
        title="Privacy Policy "
        gradientColor="0, 115, 2"
        gradientOpacity={0.4}
      />
      <PrivacyPolicy />
    </div>
  );
};

export default page;

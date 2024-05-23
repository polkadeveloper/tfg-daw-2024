// WrapperComponent.tsx
import React, { useEffect } from "react";
import { Toaster } from "sonner";
import UpdateUserInfoForm from "@/components/React/UpdateUserInfoForm";
import "@/styles/sonner.css";

function WrapperComponent(props: any) {
  return (
    <>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <Toaster position="top-right" expand={true} richColors theme="dark" />
      </div>
      <UpdateUserInfoForm {...props} />
    </>
  );
}

export default WrapperComponent;

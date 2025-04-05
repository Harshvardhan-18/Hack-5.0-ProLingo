"use client";
import dynamic from "next/dynamic";

const App = dynamic(() => import("../app/admin/app"), { ssr: false });

const ClientWrapper = () => {
  return <App />;
};

export default ClientWrapper;

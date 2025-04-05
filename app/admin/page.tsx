import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import ClientWrapper from "@/components/client-wrapper";// Import the new wrapper

const AdminPage = () => {
  if (!isAdmin()) {
    redirect("/");
  }

  return  <ClientWrapper />;
};

export default AdminPage;

import AdminDashboard from "@/components/Admin/AdminDashboard";
import { GetServerSideProps } from "next";
import { getAdminDashboardData } from "@/lib/dashboard-data";
import { AdminDashboardData } from "@/lib/types";

type AdminProps = {
  data: AdminDashboardData;
};

export default function Admin({ data }: AdminProps) {
  return <AdminDashboard data={data} />;
}

export const getServerSideProps: GetServerSideProps<AdminProps> = async () => {
  const data = await getAdminDashboardData();

  return {
    props: {
      data,
    },
  };
};

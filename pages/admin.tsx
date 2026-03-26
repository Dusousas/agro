import AdminDashboard from "@/components/Admin/AdminDashboard";
import { GetServerSideProps } from "next";
import { getAdminDashboardData } from "@/lib/dashboard-data";
import { AdminDashboardData } from "@/lib/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

type AdminProps = {
  data: AdminDashboardData;
};

export default function Admin({ data }: AdminProps) {
  return <AdminDashboard data={data} />;
}

export const getServerSideProps: GetServerSideProps<AdminProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (!isAdminEmail(session.user.email)) {
    return {
      redirect: {
        destination: "/painel",
        permanent: false,
      },
    };
  }

  const data = await getAdminDashboardData();

  return {
    props: {
      data,
    },
  };
};

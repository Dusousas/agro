import PainelDashboard from "@/components/Painel/PainelDashboard";
import { GetServerSideProps } from "next";
import { getCustomerDashboardData } from "@/lib/dashboard-data";
import { CustomerDashboardData } from "@/lib/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCustomerByEmail } from "@/lib/customer";

type PainelProps = {
  data: CustomerDashboardData;
};

export default function Painel({ data }: PainelProps) {
  return <PainelDashboard data={data} />;
}

export const getServerSideProps: GetServerSideProps<PainelProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const customer = await getCustomerByEmail(session.user.email);

  if (!customer?.complete) {
    return {
      redirect: {
        destination: "/onboarding",
        permanent: false,
      },
    };
  }

  if (!customer.hasSubscription) {
    return {
      redirect: {
        destination: "/assinaturas",
        permanent: false,
      },
    };
  }

  const data = await getCustomerDashboardData(session.user.email);

  return {
    props: {
      data,
    },
  };
};

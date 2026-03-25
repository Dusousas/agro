import PainelDashboard from "@/components/Painel/PainelDashboard";
import { GetServerSideProps } from "next";
import { getCustomerDashboardData } from "@/lib/dashboard-data";
import { CustomerDashboardData } from "@/lib/types";

type PainelProps = {
  data: CustomerDashboardData;
};

export default function Painel({ data }: PainelProps) {
  return <PainelDashboard data={data} />;
}

export const getServerSideProps: GetServerSideProps<PainelProps> = async () => {
  const data = await getCustomerDashboardData();

  return {
    props: {
      data,
    },
  };
};

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateCustomerDashboardProfile } from "@/lib/customer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
        return res.status(401).json({ ok: false, message: "Nao autenticado." });
    }

    const city = String(req.body?.city ?? "").trim();
    const addressLine = String(req.body?.addressLine ?? "").trim();
    const addressReference = String(req.body?.addressReference ?? "").trim();
    const deliveryDay = String(req.body?.deliveryDay ?? "").trim();
    const deliveryWindow = String(req.body?.deliveryWindow ?? "").trim();
    const basketProfile = String(req.body?.basketProfile ?? "").trim();

    if (!city || !addressLine || !deliveryDay || !deliveryWindow || !basketProfile) {
        return res.status(400).json({
            ok: false,
            message: "Preencha cidade, endereco, dia, janela e perfil da cesta.",
        });
    }

    const updated = await updateCustomerDashboardProfile(session.user.email, {
        city,
        addressLine,
        addressReference,
        deliveryDay,
        deliveryWindow,
        basketProfile,
    });

    if (!updated) {
        return res.status(400).json({ ok: false, message: "Nao foi possivel atualizar seus dados agora." });
    }

    return res.status(200).json({ ok: true });
}

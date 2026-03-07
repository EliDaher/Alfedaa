import { invoiceClient } from "@/lib/axios";


export default async function getPOSUsers() {
    try {
        const res = await invoiceClient.get("/api/admin/all-user");
        return res.data;
    } catch (error) {
        console.error("Error getting invoices:", error);
        return { success: false, error };
    }
}

export async function getPOSDebt() {
    try {
        const res = await invoiceClient.get("/api/admin/daen");
        console.log(res.data)
        return res.data;
    } catch (error) {
        console.error("Error getting invoices:", error);
        return { success: false, error };
    }
}

export async function addPOSPayment({id, amount}) {
    try {
        const res = await invoiceClient.put(`/api/admin/addbatch/${id}`,{
            amount
        });
        return res.data;
    } catch (error) {
        console.error("Error getting invoices:", error);
        return { success: false, error };
    }
}

export async function endPOSDebt({id, email, amount}) {
    try {
        const res = await invoiceClient.post(`/api/admin/confirm-daen`,{
            id,
            email,
            amount,
        });
        return res.data;
    } catch (error) {
        console.error("Error getting invoices:", error);
        return { success: false, error };
    }
}

export async function deleteDebt(id: string) {
    try {
        const res = await invoiceClient.delete(`/admin/delete/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error getting invoices:", error);
        return { success: false, error };
    }
}

export async function addPOSUser({formData, email}) {
    try {
        const res = await invoiceClient.post(`/api/point/add-point`,{
            formData,
            email,
        });
        return res.data;
    } catch (error) {
        console.error("Error getting invoices:", error);
        throw error;
    }
}

export async function addPOSMainUser({formData}) {
    try {
        const res = await invoiceClient.post(`/api/user`, formData);
        return res.data;
    } catch (error) {
        console.error("Error getting invoices:", error);
        throw error;
    }
}

export async function deletePOSPayment({id}) {
    try {
        const res = await invoiceClient.delete(`/api/admin/delete/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error getting invoices:", error);
        throw error;
    }
}


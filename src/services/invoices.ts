import { invoiceClient } from "@/lib/axios";

export default async function getPendingInvoices() {
  try {
    const res = await invoiceClient.get("/api/admin/pending");
    return res.data;
  } catch (error) {
    console.error("Error getting invoices:", error);
    return { success: false, error };
  }
}

export async function getDoneInvoices() {
  try {
    const res = await invoiceClient.get("/api/admin/user/allconfirmed");
    return res.data;
  } catch (error) {
    console.error("Error getting invoices:", error);
    return { success: false, error };
  }
}

export async function getDoneInvoicesByDate(fromDate: string, toDate: string) {
  try {
    const res = await invoiceClient.get("/api/admin/payments/bydate", {
      params: {
        fromDate,
        toDate,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting invoices:", error);
    return { success: false, error };
  }
}

export async function getPayments() {
  try {
    const res = await invoiceClient.get("/api/saveBalance/all-admin");
    return res.data;
  } catch (error) {
    console.error("Error getting invoices:", error);
    return { success: false, error };
  }
}

export async function confirmInvoice(id: string) {
  try {
    const res = await invoiceClient.patch(`/api/admin/confirm/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting invoices:", error);
    return { success: false, error };
  }
}

export async function confirmPayment(id: any, email: string, amount: any) {
  try {
    const res = await invoiceClient.post(`/api/admin/confirm-payment`, {
      id: id,
      email: email,
      amount: amount,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error getting invoices:", error);
    return { success: false, error };
  }
}

export async function rejectInvoice({ payment, reason }: any) {
  try {
    console.log(payment);
    const res = await invoiceClient.post(`/api/admin/reject/${payment.id}`, {
      email: payment.email,
      amount: payment.amount,
      reason,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting invoices:", error);
    return { success: false, error };
  }
}

export async function startPayment(id: string) {
  try {
    const res = await invoiceClient.patch(`/api/admin/start/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting invoices:", error);
    return { success: false, error };
  }
}

import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AddUserForm from "@/components/posUsers/AddUserForm";
import { Button } from "@/components/ui/button";
import PopupForm from "@/components/ui/custom/PopupForm";
import { Input } from "@/components/ui/input";
import getPOSUsers, {
  addPOSPayment,
  addPOSUser,
  deleteDebt,
  endPOSDebt,
  getPOSDebt,
} from "@/services/pos";
import { dividerClasses } from "@mui/material/Divider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export default function POSUsers() {

  const [daherUser, setDaherUser] = useState<Record<string, any> | null>(null);
  
  useEffect(()=>{
    const temUser = JSON.parse(localStorage.getItem("DaherUser") || "null");
    setDaherUser(temUser)
  },[])

  const [amount, setAmount] = useState(0);
  const [openUserId, setOpenUserId] = useState(null);
  const [openUserId2, setOpenUserId2] = useState(null);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: "",
    agent: "",
    owner: "",
    password: "",
    number: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { data: posData, isLoading: posLoading } = useQuery({
    queryKey: ["POSUsers-table"],
    queryFn: getPOSUsers,
  });

  const { data: debtData, isLoading: debtLoading } = useQuery({
    queryKey: ["POSdebt-table"],
    queryFn: getPOSDebt,
  });

  const mutation = useMutation({
    mutationFn: addPOSPayment,
    onSuccess: () => {
      alert("تمت إضافة الدفعة.");
      queryClient.invalidateQueries({
        queryKey: ["POSdebt-table"],
      });
      setOpenUserId(null);
      setAmount(0);
    },
    onError: () => {
      alert("حدث خطأ أثناء الإرسال.");
    },
  });

  const endDebtMutation = useMutation({
    mutationFn: endPOSDebt,
    onSuccess: () => {
      alert("تم انهاء الدين.");
      queryClient.invalidateQueries({
        queryKey: ["POSdebt-table"],
      });
      setOpenUserId(null);
      setAmount(0);
    },
    onError: () => {
      alert("حدث خطأ أثناء الإرسال.");
    },
  });
  
  const deleteDebtMutation = useMutation({
    mutationFn: deleteDebt,
    onSuccess: () => {
      alert("تم حذف الدفعة.");
      queryClient.invalidateQueries({
        queryKey: ["POSdebt-table"],
      });
      setOpenUserId(null);
      setAmount(0);
    },
    onError: () => {
      alert("حدث خطأ أثناء الإرسال.");
    },
  });

  const addPoint = useMutation({
    mutationFn: addPOSUser,
    onSuccess: () => {
      alert("تم اضافة نقطة البيع.");
      queryClient.invalidateQueries({
        queryKey: ["POSUsers-table"],
      });
      setOpenUserId(null);
      setAmount(0);
    },
    onError: () => {
      alert("حدث خطأ أثناء الإرسال.");
    },
  });

  const posColumns = [
    { key: "_id", label: "المعرف", sortable: true, hidden: true },
    { key: "name", label: "الاسم", sortable: true },
    { key: "email", label: "email", sortable: true },
    { key: "password", label: "كلمة السر", sortable: true },
    { key: "role", label: "الصلاحية", sortable: true },
    { key: "balance", label: "الرصيد", sortable: true },
    { key: "number", label: "الرقم", sortable: true },
  ];

  const debtColumns = [
    { key: "_id", label: "المعرف", sortable: true, hidden: true },
    { key: "destination", label: "الوجهة", sortable: true, hidden: true },
    { key: "name", label: "الاسم", sortable: true },
    { key: "number", label: "الرقم", sortable: true },
    { key: "operator", label: "المنفذ", sortable: true, hidden: true },
    { key: "amount", label: "الكمية", sortable: true },
    { key: "date", label: "التاريخ", sortable: true },
  ];

  const totalDebt = useMemo(() => {
    return debtData?.reduce((sum, c) => sum + Number(c.amount), 0) ?? 0;
  }, [debtData]);

  const totalBalances = useMemo(() => {
    return posData?.reduce((sum, c) => sum + Number(c.balance), 0) ?? 0;
  }, [posData]);

  if (posLoading || debtLoading) {
    return (
      <DashboardLayout>
        <div dir="rtl" className="space-y-6 text-center text-lg font-semibold">
          جارِ تحميل البيانات...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div dir="rtl" className="">
        <div className="mb-4 flex justify-start">
          <AddUserForm />
        </div>
        <DataTable
          className="mb-4"
          title="نقاط البيع"
          description={totalBalances.toFixed(0)}
          columns={posColumns}
          data={posData}
          renderRowActions={(row) => (
            (daherUser?.username == "Alfa") ?
            (
            <div className="flex gap-2">
              <PopupForm
                title="اضافة دفعة لنقطة البيع"
                trigger={<Button variant="accent">اضافة دفعة</Button>}
                isOpen={openUserId === row._id}
                setIsOpen={(open) => setOpenUserId(open ? row._id : null)}
              >
                <div>
                  <form
                    className="gap-4 flex flex-col"
                    onSubmit={(e) => {
                      e.preventDefault();
                      mutation.mutate({ id: openUserId, amount });
                    }}
                  >
                    <Input
                      readOnly={true}
                      value={
                        row.name ? row.name + "  //  " + row.email : row.email
                      }
                      title="نقطة البيع"
                    ></Input>

                    <Input
                      value={amount}
                      onChange={(e) => {
                        setAmount(Number(e.target.value));
                      }}
                      type="number"
                      title="قيمة الدفعة"
                    ></Input>

                    <Button>
                      {mutation.isPending ? "جاري التاكيد ..." : "تأكيد"}
                    </Button>
                  </form>
                </div>
              </PopupForm>
              <PopupForm
                title="إضافة نقطة بيع"
                trigger={<Button>اضافة نقطة بيع فرعية</Button>}
                isOpen={openUserId2 === row._id}
                setIsOpen={(open) => setOpenUserId2(open ? row._id : null)}
              >
                <div>
                  <form
                    className="gap-4 flex flex-col"
                    onSubmit={(e) => {
                      e.preventDefault();
                      addPoint.mutate({ formData: formData, email: row.email });
                    }}
                  >
                    <Input
                      type="text"
                      name="username"
                      placeholder="اسم المستخدم"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <Input
                      type="text"
                      name="password"
                      placeholder="كلمة المرور"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <Input
                      type="text"
                      name="number"
                      placeholder="رقم الخليوي"
                      value={formData.number}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <Input
                      type="text"
                      name="agent"
                      placeholder="الوكيل"
                      value={row.email}
                      readOnly
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />

                    <Input
                      type="text"
                      name="owner"
                      placeholder="اسم صاحب النقطة"
                      value={formData.owner}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />

                    <Button>
                      {mutation.isPending ? "جاري التاكيد ..." : "تأكيد"}
                    </Button>
                  </form>
                </div>
              </PopupForm>
            </div>
            ) : null  
          )}
        />

        <DataTable
          title="ديون نقاط البيع"
          description={totalDebt}
          columns={debtColumns}
          data={debtData}
          renderRowActions={(row) => {
              return (
                <div className="flex gap-2">
                  <Button
                    disabled={endDebtMutation.isPending}
                    onClick={() => {
                      window.confirm("هل انت متأكد من العملية ؟") &&
                        endDebtMutation.mutate({
                          id: row._id,
                          email: row.email,
                          amount: row.amount,
                        });
                    }}
                  >
                    {endDebtMutation.isPending
                      ? "جاري الانهاء..."
                      : "انهاء الدين"}
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={deleteDebtMutation.isPending}
                    onClick={() => {
                      window.confirm("هل انت متأكد من العملية ؟") &&
                        deleteDebtMutation.mutate(row._id);
                    }}
                  >
                    {deleteDebtMutation.isPending
                      ? "جاري الانهاء..."
                      : "الغاء الدفعة"}
                  </Button>
                </div>
              );
          }}
        />
      </div>
    </DashboardLayout>
  );
}

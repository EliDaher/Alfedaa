import { DataTable } from '@/components/dashboard/DataTable';
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button';
import PopupForm from '@/components/ui/custom/PopupForm';
import { confirmPayment, getPayments } from '@/services/invoices';
import { deletePOSPayment } from '@/services/pos';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function POSPayments() {

    const [isOpen, setIsOpen] = useState(false);
    const [formTitle] = useState('تأكيد الدفعة');
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

    const queryClient = useQueryClient();
    
    const confirmMutation = useMutation({
        mutationFn: ({ id, email, amount }: { id: any, email: string; amount: any }) => 
            confirmPayment(id, email, amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-table'] });
        },
    });

    const deletePayment = useMutation({
      mutationFn: deletePOSPayment,
      onSuccess: () => {
        alert("تم حذف الدفعة.");
        queryClient.invalidateQueries({ queryKey: ["payment-table"] });
      },
      onError: () => {
        alert("حدث خطأ أثناء الإرسال.");
      },
    });

    // جلب الفواتير المعلقة
    const { data: paymentData, isLoading: paymentLoading } = useQuery({
        queryKey: ['payment-table'],
        queryFn: getPayments,
    });

    const invoicesColumns = [
        { key: '_id', label: 'المعرف', sortable: true, hidden: true },
        { key: 'destination', label: 'الوجهة', sortable: true },
        { key: 'name', label: 'الاسم', sortable: true },
        { key: 'number', label: 'الرقم', sortable: true },
        { key: 'operator', label: 'العملية', sortable: true },
        { key: 'amount', label: 'المبلغ', sortable: true },
        { key: 'noticeNumber', label: 'ملاحظة', sortable: true },
        { key: 'date', label: 'التاريخ', sortable: true },
        { key: 'isConfirmed', label: 'الحالة', sortable: true },
        { key: 'createdAt', label: 'تاريخ العملية', sortable: true },
    ];

    if (paymentLoading) {
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
        <PopupForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={formTitle}
          trigger={<></>}
        >
          <div className="flex flex-row-reverse gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedRow) {
                  confirmMutation.mutate({
                    id: selectedRow._id,
                    email: selectedRow.name,
                    amount: selectedRow.amount,
                  });
                }
                setIsOpen(false);
              }}
              className="space-y-4 w-full"
            >
              {selectedRow && (
                <p className="text-right">
                  هل تريد تأكيد الدفعة بقيمة {selectedRow.amount} للمستخدم{" "}
                  <strong className="text-lg">{selectedRow.name}</strong>
                </p>
              )}
              <Button disabled={confirmMutation.isPending ? true : false} type="submit">
                {!confirmMutation.isPending ? "تأكيد قبول الدفعة" : "جاري التأكيد"}
              </Button>
            </form>
          </div>
        </PopupForm>

        <div dir="rtl" className="space-y-6">
          <DataTable
            title="دفعات نقاط البيع"
            description=""
            columns={invoicesColumns}
            data={paymentData ? paymentData : []}
            renderRowActions={(row: any) => (
              <div className="flex gap-2">
                <Button
                  disabled={confirmMutation.isPending ? true : false}
                  variant={row.isConfirmed ? "default" : "destructive"}
                  className="capitalize"
                  onClick={() => {
                    setSelectedRow(row);
                    setIsOpen(true);
                  }}
                >
                  {confirmMutation.isPending
                    ? "..."
                    : row.isConfirmed
                      ? "تم التأكيد"
                      : "بحاجة الى تأكيد"}
                </Button>

                <Button
                  variant="destructive"
                  className="capitalize"
                  onClick={() => {
                    if(window.confirm(`هل أنت متأكد من حذف هذه الدفعة بقيمة ${row.amount} لنقطة البيع ${row.name}؟`)){
                        deletePayment.mutate({ id: row._id });
                    }
                  }}
                >
                  حذف
                </Button>
              </div>
            )}
          />
        </div>
      </DashboardLayout>
    );
}

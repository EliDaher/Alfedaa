import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { getDoneInvoicesByDate } from "@/services/invoices";

export default function DoneTransactions() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // 🔹 فلاتر الفرونت فقط
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedEmail, setSelectedEmail] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 🔸 تنسيق التواريخ
  const fromDate = dateRange?.from
    ? new Date(dateRange.from.getTime() + Math.abs(dateRange.from.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0]
    : "";

  const toDate = dateRange?.to
    ? new Date(dateRange.to.getTime() + Math.abs(dateRange.to.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0]
    : "";

  // ⚙️ جلب البيانات من السيرفر فقط حسب التاريخ
  const {
    data: doneData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["done-invoices", fromDate, toDate],
    queryFn: () => getDoneInvoicesByDate(fromDate, toDate),
    enabled: !!fromDate && !!toDate,
  });

  // 🧮 تطبيق الفلاتر محليًا في الفرونت
  const filteredData = useMemo(() => {
    return doneData
      
      .filter((item: any) => (selectedCompany === "all" ? true : item.company === selectedCompany))
      .filter((item: any) => (selectedStatus === "all" ? true : item.status === selectedStatus))
      .filter((item: any) => (selectedEmail === "all" ? true : item.email === selectedEmail))
      .filter((item: any) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          item.landline?.toLowerCase().includes(term) ||
          item.email?.toLowerCase().includes(term) ||
          item.note?.toLowerCase().includes(term)
        );
      });
  }, [
    doneData,
    selectedCompany,
    selectedEmail,
    selectedStatus,
    searchTerm,
  ]);

    const columns = [
        { key: "_id", label: "المعرف", sortable: true, hidden: true },
        { key: "landline", label: "الرقم", sortable: true },
        { key: "company", label: "الشركة", sortable: true },
        { key: "speed", label: "السرعة", sortable: true },
        { key: "email", label: "الحساب المرسل", sortable: true },
        { key: "amount", label: "المبلغ المسدد", sortable: true },
        { key: "status", label: "حالة العملية", sortable: true },
        { key: "paymentMethod", label: "طريقة الدفع", sortable: true },
        { key: "note", label: "ملاحظات", sortable: true },
        { key: "createdAt", label: "تاريخ العملية", sortable: true },
    ];

    const companyList = useMemo(() => {
        const unique = new Set<string>();
        doneData.forEach((item: any) => {
          if (item.company) unique.add(item.company);
        });
        return Array.from(unique);
    }, [doneData]);
    
    const posList = useMemo(() => {
        const unique = new Set<string>();
        doneData.forEach((item: any) => {
          if (item.email) unique.add(item.email);
        });
        return Array.from(unique);
    }, [doneData]);
    
    const totalAmount = useMemo(() => {
        return filteredData.reduce((acc: number, item: any) => {
          if (item.amount) acc += item.amount;
          return acc;
        }, 0);
    }, [filteredData]);

  // 💡 تحميل / خطأ
  if (isLoading) {
    return (
      <DashboardLayout>
        <div dir="rtl" className="flex h-[70vh] items-center justify-center text-lg font-semibold">
          جارِ تحميل البيانات...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div dir="rtl" className="flex h-[70vh] items-center justify-center text-red-600 text-lg font-semibold">
          حدث خطأ أثناء تحميل البيانات
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div dir="rtl" className="space-y-6">
        {/* 🎛️ الفلاتر */}
        <Card className="p-2 space-y-4">
            <CardHeader className="text-3xl font-semibold">
                الفلاتر
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
            {/* الشركة */}
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الشركة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {companyList.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* البريد الإلكتروني */}
            <Select value={selectedEmail} onValueChange={setSelectedEmail}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الشركة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {posList.map((email) => (
                  <SelectItem key={email} value={email}>
                    {email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* الحالة */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="تم التسديد">تم التسديد</SelectItem>
                <SelectItem value="غير مسددة">غير مسددة</SelectItem>
                <SelectItem value="مرفوضة">مرفوضة</SelectItem>
              </SelectContent>
            </Select>

            {/* المدة الزمنية */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="whitespace-nowrap">
                  {dateRange?.from && dateRange?.to
                    ? `من ${fromDate} إلى ${toDate}`
                    : "اختر المدة الزمنية"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            </CardContent>
        </Card>

        {/* 🧾 جدول البيانات */}
        <DataTable
          title="التسديدات المنتهية"
          description={`إجمالي المبلغ: ${totalAmount.toLocaleString()}`}
          columns={columns}
          data={filteredData}
        />
      </div>
    </DashboardLayout>
  );
}

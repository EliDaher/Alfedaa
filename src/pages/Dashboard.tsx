import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Activity,
  CreditCard,
  ReceiptIcon,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getTodyBalance, { getBalanceByDate } from "@/services/balance";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import getPendingInvoices from "@/services/invoices";
import { io, Socket } from "socket.io-client";

export default function Dashboard() {
  const navigate = useNavigate()
  const daherUser = JSON.parse(localStorage.getItem('DaherUser'))

  const [totalBalance, setTotalBalance] = useState(0)
  const [customers, setCustomers] = useState([])
  const [todayBalance, setTodayBalance] = useState([])
  const [monthBalance, setMonthBalance] = useState([])
  const [balanceDate, setBalanceDate] = useState('')

  const [socket, setSocket] = useState<Socket | null>(null);
  const queryClient = useQueryClient();

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-table'],
    queryFn: getPendingInvoices,
  });

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);
  
  const prevDataRef = useRef<any[]>([]);
  
  useEffect(() => {
    if (pendingData && pendingData.length > 0) {
      const prevData = prevDataRef.current;

      // استخراج الطلبات الجديدة فقط
      const newItems = pendingData.filter(
        (item) => !prevData.some((prev) => prev._id === item._id)
      );

      if (newItems.length > 0) {
        // إرسال إشعار بأول عنصر جديد كمثال
        new Notification("طلب دفع جديد", {
          body: `المبلغ: ${newItems[0].amount} - الشركة: ${newItems[0].company}`,
          icon: "/logo.png"
        });

        const audio = new Audio("../../public/notification.mp3");
        audio.play();
      }

      // تحديث النسخة السابقة
      prevDataRef.current = pendingData;
    }
  }, [pendingData]);
  

  useEffect(() => {
    const newSocket = io("https://paynet-main-nasar.onrender.com");
    setSocket(newSocket);

    newSocket.on("pendingPaymentsUpdate", (updatedPayments) => {
      queryClient.setQueryData(['pending-table'], updatedPayments);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [queryClient]);

  const getMonthTable = async () => {
    const res = await getBalanceByDate("");
    if(res?.success){
      setMonthBalance(res.BalanceTable);
    }else{
      console.error(res)
    }
  }
  
  const getBalance = async () => {
    const res = await getTodyBalance("")
    if (res?.success) {
      setTodayBalance(res.BalanceTable);
  
    } else {
      console.log(res?.error || "فشل جلب البيانات");
    }
    console.log(res)
  }

  useEffect(() => {
    getBalance();
  }, []);


  const totalSpeed = useMemo(() => {
    return customers.reduce((sum, c) => sum + Number(c.SubscriptionSpeed), 0);
  }, [customers]);

  const unpaidValue = useMemo(() => {
    const totalDebt = customers
      .filter(c => c.Balance < 0)
      .reduce((sum, c) => sum + Number(c.Balance), 0);

    return Math.abs(totalDebt);
  }, [customers]);

  useEffect(()=>{

    let temValue = 0
    todayBalance.forEach(ele => {
      temValue += ele.total
    })
    setTotalBalance(temValue)
    
  }, [todayBalance])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Cards */}
        <div dir="rtl" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          { daherUser.role != 'admin' ? <></> : <>
            <StatsCard
            onClick={()=>{
              navigate('/PendingTransactions')
            }}
            title="الفواتير الغير مدفوعة"
            value={pendingData ? pendingData.length : 0}
            icon={ReceiptIcon}
            />
          </>}
        </div>
      </div>
    </DashboardLayout>
  );
}

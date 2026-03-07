import React, { useState } from 'react'
import PopupForm from '../ui/custom/PopupForm';
import { Button } from '../ui/button';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { addPOSMainUser } from '@/services/pos';
import { Input } from '../ui/input';

export default function AddUserForm() {

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      number: "",
      password: "",
      balance: 0,
      role: "user",
      createdAt: new Date().toISOString().split("T")[0],
    });
    const queryClient = new QueryClient();

    const addPoint = useMutation({
        mutationFn: addPOSMainUser,
        onSuccess: () => {
            alert('تم اضافة نقطة البيع.');
            queryClient.invalidateQueries({
              queryKey: ["POSUsers-table"],
            });
            setIsOpen(false);
        },
        onError: () => {
            alert('حدث خطأ أثناء الإرسال.');
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
      <div>
        <PopupForm
          title="إضافة نقطة بيع"
          trigger={<Button>اضافة نقطة بيع</Button>}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <div>
            <form
              className="gap-4 flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                addPoint.mutate({ formData: formData });
              }}
            >
              <Input
                type="text"
                id="name"
                name="PayNet-name"
                placeholder="الاسم الثلاثي"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              
              <Input
                type="text"
                id="email"
                name="PayNet-Email"
                placeholder="اسم المستخدم"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <Input
                type="text"
                id="password"
                name="PayNet-Password"
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <Input
                type="text"
                id="number"
                name="PayNet-Number"
                placeholder="رقم الخليوي"
                value={formData.number}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />

              <Button>
                {addPoint.isPending ? "جاري التاكيد ..." : "تأكيد"}
              </Button>
            </form>
          </div>
        </PopupForm>
      </div>
    );
}

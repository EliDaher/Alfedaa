import PopupForm from '../ui/custom/PopupForm'
import { Button } from '../ui/button'
import FormInput from '../ui/custom/FormInput'
import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import addPendingExchange from '@/services/exchange'
import { useReactToPrint } from 'react-to-print'

export default function ExchangeFrom({isOpen, setIsOpen, className}) {

    const [SYPAmount, setSYPAmount] = useState(0)
    const [USDAmount, setUSDAmount] = useState(0)
    const [details, setDetails] = useState('')

    const queryClient = useQueryClient();


    const addMutation = useMutation({
        mutationFn: (data: { sypAmount: number; usdAmount: number, details: string }) => addPendingExchange(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['pendingEx'] });
          alert('تم الاضافة بمجاح')
          handlePrint()
          setIsOpen(false)
        },
        onError: ()=> {
            alert('حدث خطأ اثناء الاضافة')
        }
    });

    const tableRef = useRef();
    
    const handlePrint = useReactToPrint({
        contentRef: tableRef, // استخدام contentRef بشكل صحيح
        pageStyle: `
          @page {
            size: 80mm auto;
            margin: 0;
          }
    
          body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            padding: 10px;
            color: black;
            direction: rtl;
          }
    
          .header {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
          }
    
          .totalValue {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            margin-top: 10px;
          }
    
          .cut {
            page-break-before: always;
            margin-top: 20px;
            text-align: center;
            font-style: italic;
          }
    
          div, span, p {
            break-inside: avoid;
          }
    
          .no-print {
            display: none !important;
          }
        `
        ,
        onAfterPrint: () => {
          console.log("تمت الطباعة بنجاح!");
          setIsOpen(false); // إغلاق النافذة بعد الطباعة
        },
    });
    
    const getCurrentDateTime = () => {
        const now = new Date();
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return now.toLocaleDateString('en-GB', options as any);
    };
    
    

    return (
        <PopupForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={'تحويل'} 
            trigger={<>
                <Button
                    className={className}
                    variant='accent'
                >
                    تحويل
                </Button>
            </>}
        >
            <form
                onSubmit={(e)=>{
                    e.preventDefault()
                    let data = {
                        sypAmount: Number(SYPAmount),
                        usdAmount: Number(USDAmount),
                        details: details
                    }
                    addMutation.mutate(data)
                }}
                className='flex flex-col gap-4'
            >

                <div ref={tableRef}>
                    <span>{getCurrentDateTime()}</span>

                    <FormInput
                        id='SYPAmount'
                        label='العملة بالليرة السورية'
                        value={SYPAmount.toString()}
                        type='number'
                        onChange={(e)=>{
                            setSYPAmount(Number(e.target.value))
                        }}
                    />

                    <FormInput
                        id='USDAmount'
                        label='العملة بالدولار'
                        value={USDAmount.toString()}
                        type='number'
                        onChange={(e)=>{
                            setUSDAmount(Number(e.target.value))
                        }}
                    />

                    <FormInput
                        id='exchangeDetails'
                        label='التفاصيل'
                        value={details.toString()}
                        type='string'
                        onChange={(e)=>{
                            setDetails(e.target.value)
                        }}
                    />
                </div>
                <Button 
                    type='submit'
                    variant='accent'
                    disabled={addMutation.isPending}
                >
                    {addMutation.isPending ? '...' : 'تأكيد عملية التحويل'}
                </Button>

            </form>
        </PopupForm>
    )
}

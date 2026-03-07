import PopupForm from '../ui/custom/PopupForm'
import { Button } from '../ui/button'
import FormInput from '../ui/custom/FormInput'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDoneExchange, deletePendingExchange } from '@/services/exchange'

export default function DoneExForm({isOpen, setIsOpen, className, SYPAmount, USDAmount, pendingId}) {

    const [finalSYP, setfinalSYP] = useState(0)
    const [finalUSD, setfinalUSD] = useState(0)
    const [details, setDetails] = useState('')

    const queryClient = useQueryClient();


    const deleteMutation = useMutation({
        mutationFn: ({ id }: any) => deletePendingExchange({ id }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pendingEx'] });
            addMutation.mutate(variables.dataToDelete);
        },
        onError: () => {
            alert('حدث خطأ أثناء الحذف');
        },
    }); 

    const addMutation = useMutation({
        mutationFn: (data: { sypAmount: number; usdAmount: number, details: string, finalSYP: number, finalUSD: number  }) => addDoneExchange(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['DoneEx'] });
          alert('تم الانهاء بمجاح')
          setIsOpen(false)
        },
        onError: ()=> {
            alert('حدث خطأ اثناء الانهاء')
        }
    });    

    return (
        <PopupForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={'انهاء عملية التحويل'} 
            trigger={<>
                <Button
                    className={className}
                    variant='accent'
                >
                    انهاء عملية التحويل
                </Button>
            </>}
        >
            <form
                onSubmit={(e)=>{
                    e.preventDefault()
                    let dataToDelete = {
                        finalSYP: finalSYP,
                        finalUSD: finalUSD,
                        sypAmount: Number(SYPAmount),
                        usdAmount: Number(USDAmount),
                        details: details
                    }
                    deleteMutation.mutate({id:pendingId, dataToDelete})
                }}
                className='flex flex-col gap-4'
            >
                <span>المتوقع {SYPAmount} ليرة الى {USDAmount} دولار</span>
                <FormInput
                    id='finalSYP'
                    label='العملة بالليرة السورية'
                    value={finalSYP.toString()}
                    type='number'
                    onChange={(e)=>{
                        setfinalSYP(Number(e.target.value))
                    }}
                />
                <FormInput
                    id='finalUSD'
                    label='العملة بالدولار'
                    value={finalUSD.toString()}
                    type='number'
                    onChange={(e)=>{
                        setfinalUSD(Number(e.target.value))
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
                
                <Button 
                    type='submit'
                    variant='accent'
                    disabled={addMutation.isPending || deleteMutation.isPending}
                >
                    {addMutation.isPending || deleteMutation.isPending ? '...' : 'تأكيد عملية التحويل'}
                </Button>

            </form>
        </PopupForm>
    )
}

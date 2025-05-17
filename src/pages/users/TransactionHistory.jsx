import { useEffect, useState } from 'react';
import axiosClient from '@/apis/axiosClient';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const formatTime = (dateStr) => {
    return format(new Date(dateStr), "HH:mm:ss dd-MM-yyyy", { locale: vi });
};

const TransactionItem = ({ item }) => {
    return (
        <div className="flex items-start justify-between py-3 border-b last:border-none">
            <div>
                <p className="font-medium text-sm text-black">{item.orderInfo}</p>
                <p className="text-xs text-gray-500">{formatTime(item.paymentTime)}</p>
            </div>
            <div className="text-right">
                <p className="text-green-600 font-semibold text-sm">
                    +{formatCurrency(item.paymentAmount)}
                </p>
                <p className="text-xs text-gray-400">Thành công</p>
            </div>
        </div>
    );
};

export default function TransactionHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient
            .getOne('/payment-histories/user')
            .then((res) => {
                setHistory(res.data || []);
            })
            .catch((err) => {
                console.error('Lỗi khi lấy dữ liệu lịch sử:', err);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-lg font-bold mb-4 text-center">Lịch sử giao dịch</h2>

            <Card className="p-4">
                {loading ? (
                    <p className="text-center text-sm text-gray-500">Đang tải...</p>
                ) : (
                    <ScrollArea className="h-[400px]">
                        {history.map((item, index) => (
                            <TransactionItem key={index} item={item} />
                        ))}
                    </ScrollArea>
                )}
            </Card>
        </div>
    );
}

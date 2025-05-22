import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import axios from "axios";
import axiosClient from "@/apis/axiosClient";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const customBlue = "#0287a8";

const TotalIncome = () => {
    const currentMonth = dayjs().startOf("month");
    const defaultFrom = dayjs().startOf("year");
    const [fromMonth, setFromMonth] = useState(defaultFrom);
    const [toMonth, setToMonth] = useState(currentMonth);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const startDate = fromMonth.startOf("month").format("YYYY-MM-DDTHH:mm:ss");
                const endDate = toMonth.endOf("month").format("YYYY-MM-DDTHH:mm:ss");

                const res = await axiosClient.get("/payment-histories/monthly-revenue", {
                    params: { startDate, endDate },
                });

                setMonthlyRevenue(res.data || []);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu doanh thu:", err);
                setMonthlyRevenue([]);
            }
        };

        fetchRevenue();
    }, [fromMonth, toMonth]);


    const selectedData = useMemo(() => {
        const labels = [];
        const data = [];
        let cursor = fromMonth.startOf("month");
        let index = 0;

        while (cursor.isBefore(toMonth.endOf("month")) || cursor.isSame(toMonth, "month")) {
            labels.push(cursor.format("MM/YYYY"));
            data.push(monthlyRevenue[index] || 0);
            cursor = cursor.add(1, "month");
            index++;
        }

        const total = data.reduce((sum, val) => sum + val, 0);
        return { labels, data, total };
    }, [fromMonth, toMonth, monthlyRevenue]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: "#fff", color: customBlue }}>
                <Stack spacing={3}>
                    {/* Bộ lọc tháng */}
                    <Stack direction="row" spacing={2}>
                        <DatePicker
                            views={["year", "month"]}
                            label="Từ tháng"
                            value={fromMonth}
                            maxDate={dayjs()}
                            onChange={(newValue) => setFromMonth(newValue.startOf("month"))}
                            slotProps={{ textField: { size: "small", sx: { maxWidth: 140 } } }}
                        />
                        <DatePicker
                            views={["year", "month"]}
                            label="Đến tháng"
                            value={toMonth}
                            maxDate={dayjs()}
                            minDate={fromMonth}
                            onChange={(newValue) => setToMonth(newValue.startOf("month"))}
                            slotProps={{ textField: { size: "small", sx: { maxWidth: 140 } } }}
                        />
                    </Stack>

                    {/* Tổng doanh thu */}
                    <Stack direction="row" justifyContent="space-between">
                        <Stack spacing={1}>
                            <Typography variant="body2" fontWeight="bold">
                                Tổng doanh thu
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {selectedData.total.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Stack direction="row" justifyContent="flex-end" spacing={2}>
                                <TrendingUpOutlinedIcon fontSize="small" />
                                <Typography variant="body2" fontWeight="bold">
                                    +%
                                </Typography>
                            </Stack>
                            <Typography variant="subtitle2" fontWeight={400}>
                                so với kỳ trước
                            </Typography>
                        </Stack>
                    </Stack>

                    {/* Biểu đồ */}
                    <Box>
                        <Line
                            data={{
                                labels: selectedData.labels,
                                datasets: [
                                    {
                                        label: "Doanh thu",
                                        data: selectedData.data,
                                        borderColor: customBlue,
                                        tension: 0.5,
                                        fill: false,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { ticks: { color: customBlue } },
                                    y: {
                                        ticks: {
                                            callback: (value) => `${(value / 1_000_000).toFixed(1)}M ₫`,
                                            color: customBlue,
                                        },
                                    },
                                },
                                plugins: {
                                    legend: { display: false },
                                },
                            }}
                            height={200}
                        />
                    </Box>
                </Stack>
            </Paper>
        </LocalizationProvider>
    );
};

export default TotalIncome;

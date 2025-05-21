import React, { useState, useMemo } from "react";
import {
    Box,
    Paper,
    Stack,
    Typography,
    colors,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const customBlue = "#0287a8";

// Mock doanh thu theo tháng (2024 + 2025)
const revenueData = {
    // 2024
    "2024-01": 5000000,
    "2024-02": 6200000,
    "2024-03": 5800000,
    "2024-04": 7000000,
    "2024-05": 7800000,
    "2024-06": 8000000,
    "2024-07": 6500000,
    "2024-08": 7200000,
    "2024-09": 7500000,
    "2024-10": 7700000,
    "2024-11": 8100000,
    "2024-12": 9000000,
    // 2025
    "2025-01": 9300000,
    "2025-02": 9500000,
    "2025-03": 9700000,
    "2025-04": 9900000,
    "2025-05": 10200000,
};

const TotalIncome = () => {
    const currentMonth = dayjs().startOf("month");
    const defaultFrom = dayjs().startOf("year");
    const [fromMonth, setFromMonth] = useState(defaultFrom);
    const [toMonth, setToMonth] = useState(currentMonth);

    const selectedData = useMemo(() => {
        const labels = [];
        const data = [];
        let cursor = fromMonth.startOf("month");

        while (cursor.isBefore(toMonth.endOf("month")) || cursor.isSame(toMonth, "month")) {
            const key = cursor.format("YYYY-MM");
            labels.push(cursor.format("MM/YYYY"));
            data.push(revenueData[key] || 0);
            cursor = cursor.add(1, "month");
        }

        const total = data.reduce((sum, val) => sum + val, 0);
        return { labels, data, total };
    }, [fromMonth, toMonth]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    backgroundColor: "#fff",
                    color: customBlue,
                }}
            >
                <Stack spacing={3}>
                    {/* Bộ lọc tháng bằng Date Picker */}
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
                                    x: {
                                        ticks: { color: customBlue },
                                    },
                                    y: {
                                        ticks: {
                                            callback: (value) => {
                                                const millions = value / 1_000_000;
                                                return `${millions.toFixed(1)}M ₫`;
                                            },

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

import React, { useEffect, useState } from 'react';
import MPaper from './MPaper';
import {
    Box,
    Stack,
    Typography,
    colors,
    MenuItem,
    Select,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axiosClient from '@/apis/axiosClient';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Generate array of years from current year to 15 years ago
const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 15; year--) {
        years.push(year.toString());
    }
    return years;
};

const StatisticData = () => {
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [approvedData, setApprovedData] = useState(new Array(12).fill(0));
    const [rejectedData, setRejectedData] = useState(new Array(12).fill(0));
    const years = generateYears();

    useEffect(() => {
        axiosClient.getOne(`/post/year/${year}`)
            .then(res => {
                if (res.status === 'success') {
                    setApprovedData(res.data.approvedCounts);
                    setRejectedData(res.data.rejectedCounts);
                }
            })
            .catch(err => {
                console.error('Lỗi lấy thống kê bài viết:', err);
            });
    }, [year]);

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Approved',
                data: approvedData,
                stack: 'stack 0',
                backgroundColor: "#0287a8",
                barPercentage: 0.6,
                categoryPercentage: 0.7
            },
            {
                label: 'Rejected',
                data: rejectedData,
                stack: 'stack 1',
                backgroundColor: colors.red[300],
                barPercentage: 0.6,
                categoryPercentage: 0.7
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                stacked: true
            },
            y: {
                stacked: true
            }
        },
        plugins: {
            legend: { display: false },
            title: { display: false }
        },
        elements: {
            bar: {
                borderRadius: 10
            }
        }
    };

    return (
        <MPaper title="Thống kê bài viết">
            <Stack spacing={4}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">
                        Số lượng bài được duyệt và bị từ chối theo tháng
                    </Typography>
                    <Select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        size="small"
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>

                <Stack direction="row" spacing={3} alignItems="center">
                    {chartData.datasets.map((data, index) => (
                        <Stack key={index} direction="row" alignItems="center">
                            <Box
                                sx={{
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '4px',
                                    bgcolor: data.backgroundColor,
                                    mr: 1
                                }}
                            />
                            <Typography variant="subtitle2">
                                {data.label}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>

                <Box height={300}>
                    <Bar options={chartOptions} data={chartData} />
                </Box>
            </Stack>
        </MPaper>
    );
};

export default StatisticData;

import React, { useEffect, useState } from 'react';
import MPaper from './MPaper';
import {
    Box,
    CircularProgress,
    Stack,
    Typography,
    circularProgressClasses,
    colors
} from '@mui/material';
import axiosClient from '@/apis/axiosClient';

const ToursData = () => {
    const [data, setData] = useState({
        landlordCount: 0,
        tenantCount: 0,
        totalLandlordTenant: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient.getOne('/user/type-counts')
            .then(res => {
                if (res.status === 'success') {
                    setData(res.data);
                }
            })
            .catch(error => {
                console.error('Lỗi lấy dữ liệu người dùng:', error);
            })
            .finally(() => setLoading(false));
    }, []);

    const { landlordCount, tenantCount, totalLandlordTenant } = data;

    const percentage = totalLandlordTenant > 0
        ? Math.round((landlordCount / totalLandlordTenant) * 100)
        : 0;

    const toursData = [
        {
            title: 'Chủ trọ',
            value: landlordCount,
            color: "#0287a8"
        },
        {
            title: 'Người thuê',
            value: tenantCount,
            color: colors.grey[300]
        }
    ];

    return (
        <MPaper title="Tổng số tài khoản">
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="center" p={3}>
                    <Box position="relative">
                        <CircularProgress
                            variant="determinate"
                            size={200}
                            value={100}
                            sx={{ color: colors.grey[200] }}
                        />
                        <CircularProgress
                            variant="determinate"
                            //   disableShrink
                            size={200}
                            value={percentage}
                            sx={{
                                position: 'absolute',
                                left: 0,
                                color: "#0287a8",
                                [`& .${circularProgressClasses.circle}`]: {
                                    strokeLinecap: 'round'
                                }
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="subtitle2" color={colors.grey[600]}>
                                Tổng
                            </Typography>
                            <Typography variant="h6">
                                {loading ? '...' : totalLandlordTenant}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>

                <Stack spacing={1}>
                    {toursData.map((item, index) => (
                        <Stack key={index} direction="row" justifyContent="space-between">
                            <Stack direction="row" alignItems="center">
                                <Box
                                    sx={{
                                        width: 15,
                                        height: 15,
                                        borderRadius: '4px',
                                        bgcolor: item.color,
                                        mr: 1
                                    }}
                                />
                                <Typography variant="subtitle2" color={colors.grey[700]}>
                                    {item.title}
                                </Typography>
                            </Stack>
                            <Typography variant="subtitle2">
                                {loading ? '...' : `${item.value} Tài khoản`}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
        </MPaper>
    );
};

export default ToursData;

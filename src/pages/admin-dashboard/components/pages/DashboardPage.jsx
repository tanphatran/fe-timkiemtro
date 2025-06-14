import { Grid } from '@mui/material';
import React from 'react';
import SummaryGrid from '../common/SummaryGrid';
import ToursData from '../common/ToursData';
import Animate from '../common/Animate';
import TotalIncome from '../common/TotalIncome';
import StatisticData from '../common/StatisticData';

const DashboardPage = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Animate delay={1}>
                    <ToursData />
                </Animate>
            </Grid>

            <Grid item xs={12} md={6}>
                <Animate type="fade" delay={1.5} sx={{ height: "100%" }}>
                    <TotalIncome />
                </Animate>
            </Grid>

            <Grid item xs={12}>
                <Animate delay={2}>
                    <StatisticData />
                </Animate>
            </Grid>
        </Grid>
    );
};

export default DashboardPage;

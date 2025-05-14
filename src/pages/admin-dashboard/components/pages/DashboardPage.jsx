import { Grid } from '@mui/material';
import React from 'react';
import SummaryGrid from '../common/SummaryGrid';
import ToursData from '../common/ToursData';
import Animate from '../common/Animate';
// import UserBookingCard from '../common/UserBookingCard';
import TotalIncome from '../common/TotalIncome';
import BookedData from '../common/BookedData';
import StatisticData from '../common/StatisticData';

const DashboardPage = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <SummaryGrid />
            </Grid>
            <Grid item xs={12} lg={4}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Animate delay={1}>
                            <ToursData />
                        </Animate>
                    </Grid>
                    <Grid item xs={12}>
                        <Animate delay={1.5}>
                            {/* <UserBookingCard /> */}
                        </Animate>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={8}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Animate type="fade" delay={1.5} sx={{ height: "100%" }}>
                            <TotalIncome />
                        </Animate>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Animate type="fade" delay={2} sx={{ height: "100%" }}>
                            <BookedData />
                        </Animate>
                    </Grid>
                    <Grid item xs={12}>
                        <Animate delay={2.5}>
                            <StatisticData />
                        </Animate>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DashboardPage;
import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';
import { TradingChartData } from "../types/trading"

interface Props {
    data: TradingChartData[];
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

const BotTradingChart: React.FC<Props> = ({ data }) => {
    // Prepare data for chart.js
    const chartData = {
        labels: data.map(d => new Date(d.time)),
        datasets: [
            {
                label: "Total Balance",
                data: data.map(d => d.current_total_balance),
                borderColor: "rgba(75,192,192,1)",
                fill: false,
                yAxisID: "y1", // Assign to the first y-axis
            },
            {
                label: "Total Profit",
                data: data.map(d => d.current_total_profit),
                borderColor: "rgba(54,162,235,1)",
                fill: false,
                yAxisID: "y1", // Assign to the first y-axis
            },
            {
                label: "Total Loss",
                data: data.map(d => d.current_total_loss),
                borderColor: "rgba(255,99,132,1)",
                fill: false,
                yAxisID: "y1", // Assign to the first y-axis
            },
            {
                label: "Total Wins",
                data: data.map(d => d.current_total_wins),
                borderColor: "rgba(255,206,86,1)",
                fill: false,
                yAxisID: "y2", // Assign to the second y-axis
            },
            {
                label: "Total Losses",
                data: data.map(d => d.current_total_losses),
                borderColor: "rgba(153,102,255,1)",
                fill: false,
                yAxisID: "y2", // Assign to the second y-axis
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Trading Metrics Over Time",
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        interaction: {
            mode: "nearest" as const,
            intersect: false,
        },
        scales: {
            x: {
                type: "time" as const,
                time: {
                    unit: "minute" as const,
                    tooltipFormat: "PPpp",
                },
                title: {
                    display: true,
                    text: "Time",
                },
            },
            y1: { // First y-axis for balance, profit, and loss
                type: "linear" as const,
                display: true,
                position: "left" as const,
                title: {
                    display: true,
                    text: "Balance/Profit/Loss ($)",
                },
                beginAtZero: false,
            },
            y2: { // Second y-axis for wins and losses
                type: "linear" as const,
                display: true,
                position: "right" as const,
                title: {
                    display: true,
                    text: "Wins/Losses (Count)",
                },
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false, // Prevent grid lines from overlapping
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Line options={options} data={chartData} />
        </div>
    );
};

export default BotTradingChart;

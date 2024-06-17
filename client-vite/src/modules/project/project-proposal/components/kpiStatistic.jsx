import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const KpiBarChart = ({ kpiTarget, kpiAssignment }) => {
  const data = {
    labels: kpiTarget.map(target => target?.type?.name), // Extracting KPI names for x-axis labels
    datasets: [
      {
        label: 'KPI Mục tiêu',
        key: 'target',
        data: kpiTarget.map(target => target.targetKPIValue), // Extracting KPI values for targets
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'KPI đạt được sau khi phân bổ',
        key: 'archived',
        data: kpiTarget.map(target => kpiAssignment[target.type._id]), // Extracting achieved values based on KPI types
        backgroundColor: 'rgba(153, 102, 255, 0.4)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tên KPI', // Label for x-axis,
          font: {
            weight: 'bold', // Bold font for x-axis label
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Giá trị KPI', // Label for y-axis,
          font: {
            weight: 'bold', // Bold font for x-axis label
          },
        },
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 0.1,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const datasetLabel = tooltipItem?.dataset?.label;

            const target = kpiTarget[index];
            const achieved = kpiAssignment[target?.type?._id];
            if (datasetLabel === 'KPI Mục tiêu') {
              return [
                `Tên KPI: ${target?.type?.name}`,
                // `Method: ${target.method}`,
                `Giá trị cần đạt: ${target?.targetKPIValue}`,
              ];
            } else if (datasetLabel === 'KPI đạt được sau khi phân bổ') {
              return [
                `Tên KPI: ${target?.type?.name}`,
                `Giá trị đạt được: ${achieved}`,
              ];
            } else {
              return `Unknown data`;
            }
          },
        },
      },
    },
  };

  return (
    <Bar data={data} options={options} />
  );
};

export default KpiBarChart;


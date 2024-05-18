import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.font.family = "'Source Sans Pro', sans-serif";

const data = {
	labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	datasets: [
		{
			label: '# of Votes',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
				'#f56954',
				'#00a65a',
				'#f39c12',
				'#00c0ef',
				'#3c8dbc',
				'#d2d6de'
			],
			borderColor: [
				"#fff"
			],
			hoverBorderColor: [
				"#fff"
			],
			borderWidth: 2,
			hoverOffset: 10
		},
	],
}

const options = {
	animation: {
		animateScale: true
	},
	layout: {
		padding: 15
	},
	plugins: {
		legend: {
			position: "bottom",
			labels: {
				color: "#333",
			}
		},
	},
	devicePixelRatio: 2,
	responsive: true,
	maintainAspectRatio: false
};

const ReasonChart = () => {
	return (
		<div className="chart-wrapper">
			<div className="widget-header">
				<span className="chart-title">Phân tích nguyên nhân</span>
				<IconButton sx={{ color: "#333 "}}>
					<i className="material-icons" style={{fontWeight: "bold"}}>add</i>
				</IconButton>

			</div>
			<Pie data={data} options={options} />
		</div>
	)
}

export default ReasonChart;

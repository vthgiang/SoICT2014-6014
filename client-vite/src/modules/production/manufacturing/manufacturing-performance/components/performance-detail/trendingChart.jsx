import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);
ChartJS.defaults.font.family = "'Source Sans Pro', sans-serif";

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = {
	labels,
	datasets: [
		{
			label: "Dataset 1",
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: '#3c8dbc',
			borderColor: '#3c8dbc',
		},
		{
			label: "Dataset 2",
			data: [3, 12, 4, 9, 2, 1],
			backgroundColor: '#d2d6de',
			borderColor: '#d2d6de',
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
		}
	}, scales: {
		x: {
			ticks: {
				color: "#333",
			},
		},
		y: {
			ticks: {
				color: "#333", // Màu sắc của các nhãn trục y
			},
		},
	},
	devicePixelRatio: 2,
	responsive: true,
	maintainAspectRatio: false
};

const TrendingChart = () => {
	return (
		<div className="chart-wrapper">
			<span className="chart-title">Xu hướng KPI</span>
			<Line data={data} options={options} />
		</div>
	)
}
export default connect(null, null)(withTranslate(TrendingChart))


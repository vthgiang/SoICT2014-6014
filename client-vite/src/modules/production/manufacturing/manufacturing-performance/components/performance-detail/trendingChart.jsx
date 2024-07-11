import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

import styles from "./index.module.css";

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
	}, 
	scales: {
		x: {
			ticks: {
				color: "#333",
			},
		},
		y: {
			ticks: {
				color: "#333",
			},
			beginAtZero: true
		},
	},
	devicePixelRatio: 2,
	responsive: true,
	maintainAspectRatio: false
};

const TrendingChart = (props) => {
	const { values = [], target, labels, customize } = props;

	const data = {
		labels,
		datasets: [
			{
			  label: 'Thực hiện',
			  data: values,
			  backgroundColor: customize?.theme[0],
			  borderColor: customize?.theme[0],
			  borderWidth: 2,
			  pointRadius: 2
			},
			{
			  label: 'Mục tiêu',
			  data: Array(values.length).fill(target),
			  backgroundColor: customize?.theme[1],
			  borderColor: customize?.theme[1],
			  borderWidth: 2,
			  pointRadius: 2
			}
		  ]
	}

	return (
		<div className="chart-wrapper">
			<span className={styles["widget-header"]}>Xu hướng KPI</span>
			<Line data={data} options={options} />
		</div>
	)
}
export default connect(null, null)(withTranslate(TrendingChart))


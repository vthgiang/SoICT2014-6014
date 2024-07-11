import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import styles from './index.module.css'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

ChartJS.register(ArcElement, Tooltip, Legend);
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
			position: 'bottom',
			labels: {
				color: '#333',
			}
		},
	},
	devicePixelRatio: 2,
	responsive: true,
	maintainAspectRatio: false
};

const ReasonChart = (props) => {
	const { translate, failureCauses = [] } = props;

	const labels = failureCauses.map((reason) => translate(`manufacturing.performance.${reason.type}`));
	const values = failureCauses.map((reason) => reason.count);
	
	const data = {
		labels,
		datasets: [
			{
				label: translate('manufacturing.performance.count'),
				data: values,
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

	const handleShowAddFailureModal = () => {
        window.$('#modal-add-failure').modal('show')
    }

	return (
		<div className='chart-wrapper'>
			<div className={styles['widget-header']}>
				<span>{translate('manufacturing.performance.failure_reason_analysis')}</span>
				<IconButton 
					sx={{ color: '#333' }}
					onClick={handleShowAddFailureModal}
				>
					<i className='material-icons' style={{fontWeight: 'bold'}}>add</i>
				</IconButton>

			</div>
			{values.length === 0 ? (
				<div className='text-center'>{translate('general.no_data')}</div>
			) : (
				<Pie data={data} options={options} />
			)}
		</div>
	)
}

export default connect(null, null)(withTranslate(ReasonChart));

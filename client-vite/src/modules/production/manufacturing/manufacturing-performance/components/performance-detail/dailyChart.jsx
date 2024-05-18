import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "./index.css"

const sampleData = [
	{ date: 1, state: 1 },
	{ date: 2, state: 1 },
	{ date: 3, state: 1 },
	{ date: 4, state: 1 },
	{ date: 5, state: 1 },
	{ date: 6, state: 1 },
	{ date: 7, state: 1 },
	{ date: 8, state: 1 },
	{ date: 9, state: 1 },
	{ date: 10, state: 1 },
	{ date: 11, state: 1 },
	{ date: 12, state: 1 },
	{ date: 13, state: 2 },
	{ date: 14, state: 2 },
	{ date: 15, state: 2 },
	{ date: 16, state: 2 },
	{ date: 17, state: 1 },
	{ date: 18, state: 1 },
	{ date: 19, state: 1 },
	{ date: 20, state: 1 },
	{ date: 21, state: 1 },
	{ date: 22, state: 1 },
	{ date: 23, state: 1 },
	{ date: 24, state: 1 },
	{ date: 25, state: 2 },
	{ date: 26, state: 1 },
	{ date: 27, state: 1 },
	{ date: 28, state: 1 },
	{ date: 29, state: 1 },
	{ date: 30, state: 1 },
	{ date: 31, state: 1 }
]
const DateItem = ({ state, date }) => {
	let color = ""
	switch (state) {
		case 1:
			color = "success"
			break
		case 2:
			color = "warning"
			break
		case 3:
			color = "danger"
			break
		default:
			color = "default"
			break
	}
	return (
		<span className={`date-item ${color}`}>{date}</span>
	)

}

const DetailItem = () => {
	return (
		<div className="date_detail-wrapper">
			<div className="date_detail-header">Ca sản xuất 1</div>
			<div className="date_detail-item percentage">
				<span>Percentage</span>
				<div className="circular_progress">
					<CircularProgressbar 
						value={80} 
						text="80%" 
						maxValue={100} 
						strokeWidth={12}
						styles={{
							text: {
								fill: "#333",
								fontSize: "32px"
							},
							path: {
								strokeLinecap: 'butt',
							}
						}}
					/>
				</div>
			</div>
			<div className="date_detail-item value">
				<span>Plan</span>
				<span>10</span>
			</div>
			<div className="date_detail-item value">
				<span>Actual</span>
				<span>10</span>
			</div>
			<div className="date_detail-item value">
				<span>Date</span>
				<span>29-03-2024</span>
			</div>
		</div>
	)
}

const DailyChart = () => {
	return (
		<div className="board-view" >
			<div className="monthly-overview">
				<div className="d-flex-center">
					{sampleData.slice(0, 3).map((item, id) => (
						<DateItem key={id} date={item.date} state={item.state} />
					))}
				</div>
				<div className="d-flex-center">
					{sampleData.slice(3, 6).map((item, id) => (
						<DateItem key={id} date={item.date} state={item.state} />
					))}
				</div>
				<div className="d-flex-center">
					{sampleData.slice(6, 13).map((item, id) => (
						<DateItem key={id} date={item.date} state={item.state} />
					))}
				</div>
				<div className="d-flex-center">
					{sampleData.slice(13, 16).map((item, id) => (
						<DateItem key={id} date={item.date} state={item.state} />
					))}
					<span className="date-item default">T3</span>
					{sampleData.slice(16, 19).map((item, id) => (
						<DateItem key={id} date={item.date} state={item.state} />
					))}

				</div>
				<div className="d-flex-center">
					{sampleData.slice(19, 26).map((item, id) => (
						<DateItem key={id} date={item.date} state={item.state} />
					))}

				</div>
				<div className="d-flex-center">
					{sampleData.slice(26, 29).map((item, id) => (
						<DateItem key={id} date={item.date} state={item.state} />
					))}

				</div>
				<div className="d-flex-center">
					{sampleData.slice(29, 31).map((item, id) => (
						<DateItem key={id} date={item.date} state={item.state} />
					))}
					<span className="date-item default"></span>

				</div>
			</div>
			<div className="date-detail">
				<DetailItem />
			</div>

		</div>
	)
}
export default connect(null, null)(withTranslate(DailyChart))


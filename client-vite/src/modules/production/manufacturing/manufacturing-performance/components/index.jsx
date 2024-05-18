import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'
import LineChart from './dashboard-widget/lineChart';
import SingleValue from './dashboard-widget/singleValue';
import BarChart from './dashboard-widget/barChart';
import DashboardHeader from './dashboard-component/header';
import DashboardSidebar from './dashboard-component/sidebar';

import './index.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const initItems = [
	{
		id: 1,
		title: "Năng lực sản xuất",
		value: "98%",
		trend: {
			value: 1.2,
			direction: "up"
		},
		customize: {
			icon: "groups",
			color: "#28a745"
		},
		chart: SingleValue
	},
	{
		id: 2,
		title: "Tỉ lệ chất lượng",
		value: "90%",
		trend: {
			value: 1.2,
			direction: "down"
		},
		customize: {
			icon: "workspace_premium",
			color: "#ff851b"
		},
		chart: SingleValue
	},
	{
		id: 3,
		title: "Tỉ lệ giao hàng đúng hạn",
		value: "80%",
		trend: {
			value: 2.2,
			direction: "up"
		},
		customize: {
			icon: "local_shipping",
			color: "#17a2b8"
		},
		chart: SingleValue
	},
	{
		id: 4,
		title: "Chu kỳ sản xuất",
		value: "75s",
		trend: {
			value: 1.2,
			direction: "up"
		},
		customize: {
			icon: "update",
			color: "#605ca8"
		},
		chart: SingleValue
	},
	{
		id: 5,
		title: "Thời gian ngừng hoạt động",
		value: [12, 19, 3, 5, 2, 3],
		labels: ["Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7"],
		target: 9,
		customize: {
			color: ["#17a2b8", "#ff851b"]
		},
		trend: {
			value: 1.2,
			direction: "up"
		},
		chart: LineChart
	},
	{
		id: 6,
		title: "Chi phí sản xuất",
		groupValue: [[12, 19, 3, 5, 2, 3], [3, 9, 13, 6, 2, 4], [1, 8, 4, 9, 7, 3]],
		labels: ["Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7"],
		datalabels: ["Nhân công", "Máy móc", "Nguyên vật liệu"],
		target: 9,
		customize: {
			color: ["#17a2b8", "#3d9970", "#ff851b"]
		},
		trend: {
			value: 1.2,
			direction: "up"
		},
		chart: BarChart
	}
]

const ManufacturingPerformance = () => {
	const [items, setItems] = useState(initItems)
	const [editMode, setEditMode] = useState(false)
	let history = useHistory()

	const layouts = [
		{ i: "1", x: 0, y: 0, w: 3, h: 4 },
		{ i: "2", x: 3, y: 0, w: 3, h: 4 },
		{ i: "3", x: 6, y: 0, w: 3, h: 4 },
		{ i: "4", x: 9, y: 0, w: 3, h: 4 },
		{ i: "5", x: 0, y: 4, w: 6, h: 14 },
		{ i: "6", x: 6, y: 4, w: 6, h: 14 },

	];
	const handleDelete = (id) => {
		setItems(items => items.filter(item => item.id != id))
	}

	const handleRedirectToDetail = () => {
		history.push("/detail-analysis-manufacturing-performance")
	}

	const handleToggleSidebar = () => {
		setEditMode(!editMode)
	}

	return (
		<div className='performance-dashboard' style={{ minHeight: '450px' }}>
			<DashboardHeader onToggleSidebar={handleToggleSidebar} editMode={editMode} />
			<div className='chart-container' style={{ display: "flex" }}>
				<div className='chart-grid' style={{ width: editMode ? "80%" : "100%" }}>
					<ResponsiveGridLayout
						className="layout"
						compactType="horizontal"
						layouts={{ lg: layouts, md: layouts, sm: layouts, xs: layouts, xxs: layouts }}
						breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
						cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
						resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
						rowHeight={editMode ? 12 : 15}
						draggableCancel=".cancelSelectorName"
					>
						{items.map((item) => (
							<div key={item.id} className="item">
								<item.chart
									title={item.title}
									value={item.value}
									groupValue={item.groupValue ? item.groupValue : []}
									trend={item.trend}
									customize={item.customize}
									target={item.target ? item.target : 0}
									labels={item.labels ? item.labels : []}
									datalabels={item.datalabels ? item.datalabels : []}
									onDelete={() => handleDelete(item.id)}
									onRedirectToDetail={handleRedirectToDetail}
								/>
							</div>
						))}
					</ResponsiveGridLayout>
				</div>
				{editMode && (
					<DashboardSidebar />
				)}
			</div>
		</div>
	)
}
export default connect(null, null)(withTranslate(ManufacturingPerformance))


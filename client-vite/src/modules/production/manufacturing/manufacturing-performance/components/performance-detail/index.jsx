import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'
import TrendingChart from './trendingChart';
import ReasonChart from "./reasonChart";
import Notification from './notification';
import ImproveActionTable from './improveActionTable';

import '../index.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const PerformanceDetail = () => {
	const layouts = [
		{ i: "1", x: 0, y: 0, w: 5, h: 12, static: true },
		{ i: "2", x: 5, y: 0, w: 4, h: 12, static: true },
		{ i: "3", x: 9, y: 0, w: 3, h: 24, static: true },
		{ i: "4", x: 0, y: 12, w: 9, h: 12, static: true },
		{ i: "5", x: 0, y: 24, w: 12, h: 12, static: true }
	];

	return (
		<div className='performance-dashboard' style={{ minHeight: '450px' }}>
			<div className='chart-container'>
				<ResponsiveGridLayout
					className="layout"
					compactType="horizontal"
					layouts={{ lg: layouts, md: layouts, sm: layouts, xs: layouts, xxs: layouts }}
					breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
					cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
					resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
					rowHeight={20}
				>
					<div className="item" key="1">
						<TrendingChart />
					</div>
					<div className="item" key="2">
						<ReasonChart />
					</div>
					<div className="item" key="3">
						<Notification />
					</div>
					<div className="item" key="5">
						<ImproveActionTable />
					</div>
				</ResponsiveGridLayout>
			</div>
		</div>
	)
}
export default connect(null, null)(withTranslate(PerformanceDetail))


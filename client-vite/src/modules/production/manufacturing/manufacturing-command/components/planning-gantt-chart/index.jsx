import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import Timeline, {
	CustomMarker,
	DateHeader,
	TimelineHeaders,
	SidebarHeader
} from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import { SelectBox } from '../../../../../../common-components'

import './planningGantChart.css'

const PlanningGanttChart = (props) => {
	const { translate, listCommands, editable = false } = props
	const [viewMode, setViewMode] = useState("mill")
	const [items, setItems] = useState([])

	const handleChangeViewMode = (value) => {
		setViewMode(value)
	}

	let count = 0
	const workOrderList = listCommands.flatMap(command => {
		return command.workOrders.map((wo, index) => {
			count++
			return {
				id: count,
				name: `${index + 1}/${command.code}`,
				manufacturingCommandId: command._id,
				manufacturingMillId: wo.manufacturingMill._id,
				startTime: moment(wo.startDate, "DD-MM-YYYY").add(wo.startHour, 'hour'),
				endTime: moment(wo.endDate, "DD-MM-YYYY").add(wo.endHour, 'hour')
			}
		})
	});

	const listMills = listCommands.flatMap(command => {
		return command.workOrders.map(wo => ({
			id: wo.manufacturingMill._id,
			name: wo.manufacturingMill.name
		}))
	}).filter((mill, index, self) => index === self.findIndex(m => m.id === mill.id))

	const keys = {
		groupIdKey: 'id',
		groupTitleKey: 'name',
		groupRightTitleKey: 'rightTitle',
		itemIdKey: 'id',
		itemTitleKey: 'name',
		itemDivTitleKey: 'name',
		itemGroupKey: "manufacturingMillId",
		itemTimeStartKey: 'startTime',
		itemTimeEndKey: 'endTime',
	}

	const sidebarHeader = viewMode === "mill" ?
		translate("manufacturing.command.mill") :
		translate("manufacturing.command.command")


	const handleItemResize = (itemId, time, edge) => {
		const itemIndex = items.findIndex(item => item.id === itemId);
		let updatedItems = [...items];

		if (edge === 'left') {
			updatedItems[itemIndex] = { ...updatedItems[itemIndex], startTime: time };
		} else {
			updatedItems[itemIndex] = { ...updatedItems[itemIndex], endTime: time };
		}

		setItems(updatedItems);
	};

	const handleItemMove = (itemId, dragTime, newGroupOrder) => {
		const itemIndex = items.findIndex(item => item.id === itemId);
		const item = items[itemIndex];

		const duration = item.endTime - item.startTime;

		const updatedItem = {
			...item,
			startTime: dragTime,
			endTime: dragTime + duration,
		};

		if (viewMode === "mill") {
			updatedItem.manufacturingMillId = manufacturingMillList[newGroupOrder].id;
		}

		const updatedItems = [...items];
		updatedItems[itemIndex] = updatedItem;

		setItems(updatedItems);
	};

	const itemRender = ({ item, itemContext, getItemProps, getResizeProps }) => {
		const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
		return (
			<div {...getItemProps(item.itemProps)} >
				{itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}
				<div
					className="rct-item-content"
					style={{ maxHeight: `${itemContext.dimensions.height}` }}
				>
					{itemContext.title}

				</div>
				{itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
			</div>
		)
	}

	useEffect(() => {
		setItems(workOrderList)
	}, [listCommands])

	console.log(workOrderList)
	return (

		<div className='box-body qlcv'>
			<div className='form-inline' style={{ marginBottom: "1rem" }}>
				<div className='form-group'>
					<label className='form-control-static' style={{ width: "auto" }}>
						{translate('manufacturing.command.view_by')}
					</label>
					<SelectBox
						id={`select-viewmode`}
						className='form-control select2'
						style={{ width: '100%' }}
						items={[
							{ value: "mill", text: translate("manufacturing.command.mills") },
						]}
						value={viewMode}
						onChange={handleChangeViewMode}
					/>
				</div>
			</div>
			<Timeline
				groups={listMills}
				items={items}
				keys={keys}
				lineHeight={40}
				maxZoom={30 * 86400 * 1000}
				minZoom={24 * 60 * 60 * 1000}
				defaultTimeStart={moment().add(-12, 'hour')}
				defaultTimeEnd={moment().add(12, 'hour')}
				itemRenderer={itemRender}
				canResize={editable? "both" : false}
				canMove={editable}
				onItemResize={handleItemResize}
				onItemMove={handleItemMove}
			>
				<TimelineHeaders className="timeline_header">
					<CustomMarker date={Date.now()}>
						{({ styles }) => {
							const customStyles = {
								...styles,
								backgroundColor: "red",
								width: "2px",
							};
							return <div style={customStyles} />;
						}}
					</CustomMarker>
					<SidebarHeader>
						{({ getRootProps }) => {
							return (
								<div {...getRootProps()} className="sb-header">
									{sidebarHeader}
								</div>
							);
						}}
					</SidebarHeader>
					<DateHeader unit="primaryHeader" labelFormat="MM - YYYY" />
					<DateHeader
						unit="day"
						labelFormat="DD"
						intervalRenderer={({ getIntervalProps, intervalContext }) => {
							return (
								<div {...getIntervalProps()}>
									{intervalContext.intervalText}
								</div>
							);
						}}
					/>
				</TimelineHeaders>
			</Timeline>
		</div>
	)
}

export default connect(null, null)(withTranslate(PlanningGanttChart));


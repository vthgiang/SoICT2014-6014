/* App.js */
import React from 'react';
// var Component = React.Component;
import CanvasJSReact from './canvasjs.react';

function Chart(props){
	let CanvasJS = CanvasJSReact.CanvasJS;
	let CanvasJSChart = CanvasJSReact.CanvasJSChart;
	const options = {
		animationEnabled: true,
		theme: "light2",
		title:{
			text: "Khối lượng vận chuyển"
		},
		axisX: {
			valueFormatString: "DDD"
		},
		axisY: {
			prefix: "$"
		},
		toolTip: {
			shared: true
		},
		// legend:{
			// cursor: "pointer",
			// itemclick: this.toggleDataSeries
		// },
		data: [{
			type: "stackedBar",
			name: "Meals",
			// showInLegend: "true",
			xValueFormatString: "DD, MMM",
			yValueFormatString: "$#,##0",
			dataPoints: [
				{ x: new Date(2018, 5, 25), y: 56 },
				{ x: new Date(2018, 5, 26), y: 45 },
				{ x: new Date(2018, 5, 27), y: 71 },
				{ x: new Date(2018, 5, 28), y: 41 },
				{ x: new Date(2018, 5, 29), y: 60 },
				{ x: new Date(2018, 5, 30), y: 75 },
				{ x: new Date(2018, 6, 1), y: 98 },
			]
		},
		{
			type: "stackedBar",
			name: "Snacks",
			// showInLegend: "true",
			xValueFormatString: "DD, MMM",
			yValueFormatString: "$#,##0",
			dataPoints: [
				{ x: new Date(2018, 5, 25), y: 86 },
				{ x: new Date(2018, 5, 26), y: 95 },
				{ x: new Date(2018, 5, 27), y: 71 },
				{ x: new Date(2018, 5, 28), y: 58 },
				{ x: new Date(2018, 5, 29), y: 60 },
				{ x: new Date(2018, 5, 30), y: 65 },
				{ x: new Date(2018, 6, 1), y: 89 }
			]
		},
		{
			type: "stackedBar",
			name: "Drinks",
			// showInLegend: "true",
			xValueFormatString: "DD, MMM",
			yValueFormatString: "$#,##0",
			dataPoints: [
				{ x: new Date(2018, 5, 25), y: 48 },
				{ x: new Date(2018, 5, 26), y: 45 },
				{ x: new Date(2018, 5, 27), y: 41 },
				{ x: new Date(2018, 5, 28), y: 55 },
				{ x: new Date(2018, 5, 29), y: 80 },
				{ x: new Date(2018, 5, 30), y: 85 },
				{ x: new Date(2018, 6, 1), y: 83 }
			]
		},
		{
			type: "stackedBar",
			name: "Dessert",
			// showInLegend: "true",
			xValueFormatString: "DD, MMM",
			yValueFormatString: "$#,##0",
			dataPoints: [
				{ x: new Date(2018, 5, 25), y: 61 },
				{ x: new Date(2018, 5, 26), y: 55 },
				{ x: new Date(2018, 5, 27), y: 61 },
				{ x: new Date(2018, 5, 28), y: 75 },
				{ x: new Date(2018, 5, 29), y: 80 },
				{ x: new Date(2018, 5, 30), y: 85 },
				{ x: new Date(2018, 6, 1), y: 105 }
			]
		},
		{
			type: "stackedBar",
			name: "test1",
			showInLegend: "true",
			xValueFormatString: "DD, MMM",
			yValueFormatString: "$#,##0",
			dataPoints: [
				{ x: new Date(2018, 6, 2), y: 50 },
			]
		},
		{
			type: "stackedBar",
			name: "test2",
			showInLegend: "true",
			xValueFormatString: "DD, MMM",
			yValueFormatString: "$#,##0",
			dataPoints: [
				{ x: new Date(2018, 6, 2), y: 50 }
			]
		},
		{
			type: "stackedBar",
			name: "Takeaway",
			// showInLegend: "true",
			xValueFormatString: "DD, MMM",
			yValueFormatString: "$#,##0",
			dataPoints: [
				{ x: new Date(2018, 5, 25), y: 52 },
				{ x: new Date(2018, 5, 26), y: 55 },
				{ x: new Date(2018, 5, 27), y: 20 },
				{ x: new Date(2018, 5, 28), y: 35 },
				{ x: new Date(2018, 5, 29), y: 30 },
				{ x: new Date(2018, 5, 30), y: 45 },
				{ x: new Date(2018, 6, 1), y: 25 }
			]
		}]
	}
	
	return (
		<div>
		<CanvasJSChart options = {options}
			/* onRef = {ref => this.chart = ref} */
		/>
		</div>
	);
}

export { Chart };                     
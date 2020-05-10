const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationalUnit = require('../../../super-admin/organizationalUnit.model');

const TrendsInOrganizationalUnitKpiChartSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    dataChart: [{
        type: {
            type: String,
            default: "stackedBar100"
        },
        toolTipContent: {
            type: String,
            default: "{label}<br><b>{name}:</b> {y} (#percent%)"
        },
        showInLegend: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            required: true
        },
        dataPoints: [{
            y: {
                type: Number,
                required: true
            },
            label: {
                type: String,
                required: true
            }
        }]
    }]
})

module.exports = TrendsInOrganizationalUnitKpiChart = mongoose.model('trends-in-organizational-unit-kpi-chart', TrendsInOrganizationalUnitKpiChartSchema);
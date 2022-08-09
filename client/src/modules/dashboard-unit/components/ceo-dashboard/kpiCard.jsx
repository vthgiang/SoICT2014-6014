import React from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

const KpiCard = (props) => {
    const { title, target, currentValue, previousValue, unit } = props;

    return <React.Fragment>
        <div className="card"
            style={{ 'backgroundColor': '#FFFFFF', 'borderRadius': 2, "boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2)", 'padding': 10 }}
        >
            <div className="card-body">
                <span className="card-title" style={{ "fontWeight": 600, 'fontSize': 18 }}>{title}</span>
                <p className="card-text text-info" style={{ "fontWeight": 600, 'fontSize': 20 }}>
                    <span >{unit}</span>
                    {target}
                </p>
                <div className='' style={{ 'margin': '0px', display: "flex", justifyContent: "space-between" }}>
                    <span
                        className='col-sm-5'
                        style={{ 'backgroundColor': '#EEE', 'borderRadius': 2, padding: "5px 10px", display: "flex" }}
                    >
                        <i className="fa fa-crosshairs text-info" style={{ fontSize: 18, marginRight: 10 }}></i>
                        {currentValue < target
                            ? <span className="text-danger" style={{ display: "flex", alignItems: "center" }}>
                                <i className="fa fa-sort-desc text-danger" style={{ marginBottom: 4 }} />
                                {Math.round((target - currentValue) / previousValue * 100)}%
                            </span>
                            : <span className="text-success" style={{ display: "flex", alignItems: "center" }}>
                                <i className="fa fa-sort-up text-success" style={{ marginTop: 6 }} />
                                {Math.round((currentValue - target) / previousValue * 100)}%
                            </span>
                        }
                    </span>
                    <span
                        className='col-sm-5' style={{ backgroundColor: '#EEE', borderRadius: 2, padding: "5px 10px", display: "flex" }}
                    >
                        <i className="fa fa-calendar-minus-o text-info"
                            style={{ fontSize: 18, marginRight: 10 }} />

                        {currentValue < previousValue
                            ? <span className="text-danger" style={{ display: "flex", alignItems: "center" }}>
                                <i className="fa fa-sort-desc text-danger" style={{ marginBottom: 4 }} />
                                {Math.round((previousValue - currentValue) / previousValue * 100)}%
                            </span>
                            : <span className="text-success" style={{ display: "flex", alignItems: "center" }}>
                                <i className="fa fa-sort-up text-success" style={{ marginTop: 6 }} />
                                {Math.round((currentValue - previousValue) / previousValue * 100)}%
                            </span>
                        }
                    </span>
                </div>
            </div>
        </div>
    </React.Fragment>
}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, createKpiUnit } = state;
    return { dashboardEvaluationEmployeeKpiSet, createKpiUnit };
}

const actions = {
}

const connectedKpiCard = connect(mapState, actions)(withTranslate(KpiCard));
export { connectedKpiCard as KpiCard };

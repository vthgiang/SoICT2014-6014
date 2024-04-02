
import React, { useState } from 'react'
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import './riskMatrix.css'
const RiskMatrix = (props) => {
    const {translate} = props
    return (
        <React.Fragment>
            <div className="box box-primary">
                <div className="box-header with-border">
                    <div className="box-title">{translate('risk_dash.risk_matrix.title')}</div>
                </div>
                <div className="box-body">
                    <div className="row">
                        <div className="col-sm-1">
                            <p className="vertical-rl">{translate('risk_dash.risk_matrix.probability')}</p>
                        </div>
                        <div className="col-sm-11 matrix-table">

                            <table id="matrix">
                                <tbody>
                                <tr>
                                    <td className="title">{translate('risk_dash.risk_matrix.probable')}</td>
                                    <td className="moderate"><p>{translate('risk_dash.risk_matrix.moderate')}</p>4</td>
                                    <td className="major"><p>{translate('risk_dash.risk_matrix.major')}</p>8</td>
                                    <td className="severe"><p>{translate('risk_dash.risk_matrix.severe')}</p>12</td>
                                    <td className="severe"><p>{translate('risk_dash.risk_matrix.severe')}</p>16</td>
                                </tr>
                                <tr>
                                    <td className="title">{translate('risk_dash.risk_matrix.possible')}</td>
                                    <td className="minor"><p>{translate('risk_dash.risk_matrix.minor')}</p>3</td>
                                    <td className="moderate"><p>{translate('risk_dash.risk_matrix.moderate')}</p>6</td>
                                    <td className="major"><p>{translate('risk_dash.risk_matrix.major')}</p>9</td>
                                    <td className="severe"><p>{translate('risk_dash.risk_matrix.severe')}</p>12</td>
                                </tr>
                                <tr>

                                    <td className="title">{translate('risk_dash.risk_matrix.unlikely')}</td>
                                    <td className="minor"><p>{translate('risk_dash.risk_matrix.minor')}</p>2</td>
                                    <td className="moderate"><p>{translate('risk_dash.risk_matrix.moderate')}</p>4</td>
                                    <td className="moderate"><p>{translate('risk_dash.risk_matrix.moderate')}</p>6</td>
                                    <td className="major"><p>{translate('risk_dash.risk_matrix.major')}</p>8</td>
                                </tr>
                                <tr>

                                    <td className="title">{translate('risk_dash.risk_matrix.rare')}</td>
                                    <td className="minor"><p>{translate('risk_dash.risk_matrix.minor')}</p>1</td>
                                    <td className="minor"><p>{translate('risk_dash.risk_matrix.minor')}</p>2</td>
                                    <td className="minor"><p>{translate('risk_dash.risk_matrix.minor')}</p>3</td>
                                    <td className="moderate"><p>{translate('risk_dash.risk_matrix.moderate')}</p>4</td>
                                </tr>
                                <tr >
                                    <td className="title"></td>
                                    <td className="title">{translate('risk_dash.risk_matrix.low')}</td>
                                    <td className="title">{translate('risk_dash.risk_matrix.medium')}</td>
                                    <td className="title">{translate('risk_dash.risk_matrix.high')}</td>
                                    <td className="title">{translate('risk_dash.risk_matrix.very_high')}</td>
                                </tr>
                                </tbody>
                            </table>
                            <br></br>
                            <div className="row" id = "impact-title-matrix">{translate('risk_dash.risk_matrix.impact')}</div>
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
const connectedRiskMatrix = connect(null, null)(withTranslate(RiskMatrix));
export { connectedRiskMatrix as RiskMatrix };
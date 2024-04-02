import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ShowMoreShowLess } from '../../../../common-components/index';
import { roundProb, round } from './../TaskPertHelper'
import MathJax from 'react-mathjax2'
const PertModel = (props) => {
    const { taskPert ,translate} = props
    const estimateDuration = (opt, mos, pes) => {
        return (opt + 4 * mos + pes) / 6
    }
    const standardDeviation = (opt, pes) => {
        return (pes - opt) / 6
    }
    
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-pert-data`}
                title={translate('process_analysis.pert_model.title')}
                hasSaveButton={false}
                size={100}>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="description-box">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <i style={{ fontSize: '17px', marginRight: '5px' }} className="fa fa-info-circle" aria-hidden="true"></i>
                                <h4>{translate('process_analysis.pert_model.pert')}</h4>
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.optimistic')}:</strong>
                                {round(taskPert.optimistic, 2)}
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.mostlikely')}:</strong>
                                {round(taskPert.mostlikely, 2)}
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.pessimistic')}:</strong>
                                {round(taskPert.pessimistic, 2)}
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.expected_time')}:</strong>
                                {round(taskPert.expectedTime, 2)}
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.standard_deviation')}:</strong>
                                {round(standardDeviation(taskPert.optimistic, taskPert.pessimistic), 2)}
                            </div>

                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="description-box">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <i style={{ fontSize: '17px', marginRight: '5px' }} className="fa fa-info-circle" aria-hidden="true"></i>
                                <h4>{translate('process_analysis.pert_model.cpm')}</h4>
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.duration')}:</strong>
                                {round(taskPert.duration, 2)}
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.early_start')}:</strong>
                                {round(taskPert.es, 2)}
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.early_finish')}:</strong>
                                {round(taskPert.ef, 2)}
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.late_start')}:</strong>
                                {round(taskPert.ls, 2)}
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.late_finish')}:</strong>
                                {round(taskPert.lf, 2)}
                            </div>
                            <div>
                                <strong>{translate('process_analysis.pert_model.slack')}:</strong>
                                {round(taskPert.slack, 2)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="description-box">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i style={{ fontSize: '17px', marginRight: '5px' }} className="fa fa-info-circle" aria-hidden="true"></i>
                            <h4>{translate('process_analysis.pert_model.equations')}:</h4>
                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <MathJax.Context input='tex'>
                                        <div>
                                            <MathJax.Text text={`1.${translate('process_analysis.pert_model.expected_time')}:`}></MathJax.Text>
                                            <MathJax.Node>{"expectedTime = \\frac{(optimistic+4*mostlikely+pessimistic)}{6}"}</MathJax.Node>
                                        </div>
                                    </MathJax.Context>
                                </div>
                                <div>
                                    <MathJax.Context input='tex'>
                                        <div>
                                            <MathJax.Text text={`2.${translate('process_analysis.pert_model.standard_deviation')}:`}></MathJax.Text>
                                            <MathJax.Node>{"\\sigma = \\frac{(pessimistic-optimistic)}{6}"}</MathJax.Node>
                                        </div>
                                    </MathJax.Context>
                                </div>
                                <div>
                                    <MathJax.Context input='tex'>
                                        <div>
                                            <MathJax.Text text={`3.${translate('process_analysis.pert_model.early_finish')}:`}></MathJax.Text>
                                            <MathJax.Node>{"earlyFinish_j = earlyStart_j+duartion_j"}</MathJax.Node>
                                        </div>
                                    </MathJax.Context>
                                </div>
                                <div>
                                    <MathJax.Context input='tex'>
                                        <div>
                                            <MathJax.Text text={`4.${translate('process_analysis.pert_model.early_start')}:`}></MathJax.Text>
                                            <MathJax.Node >{"earlyStart_j = max\\{earlyFinish_i\\} \\text{with i<j}"}</MathJax.Node>
                                        </div>
                                    </MathJax.Context>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                
                                <div>
                                    <MathJax.Context input='tex'>
                                        <div>
                                            <MathJax.Text text={`5.${translate('process_analysis.pert_model.late_start')}:`}></MathJax.Text>
                                            <MathJax.Node>{"lateStart_j = lateFinish_j-duartion_j"}</MathJax.Node>
                                        </div>
                                    </MathJax.Context>
                                </div>
                                <div>
                                    <MathJax.Context input='tex'>
                                        <div>
                                            <MathJax.Text text={`6.${translate('process_analysis.pert_model.late_finish')}:`}></MathJax.Text>
                                            <MathJax.Node>{"lateFinish_j= min\\{lateStart_i\\} \\text{   with j<i}"}</MathJax.Node>
                                        </div>
                                    </MathJax.Context>
                                </div>
                                <div>
                                    <MathJax.Context input='tex'>
                                        <div>
                                            <MathJax.Text text={`7.${translate('process_analysis.pert_model.slack')}:`}></MathJax.Text>
                                            <MathJax.Node>{"\\text{slack}_j= lateStart_j-earlyStart_j"}</MathJax.Node>
                                        </div>
                                    </MathJax.Context>
                                </div>
                                <div>
                                    <MathJax.Context input='tex'>
                                        <div>
                                            <MathJax.Text text={`8.${translate('process_analysis.pert_model.success_probability')}:`}></MathJax.Text>
                                            <MathJax.Node>{"Probability_j=cdf(duration,expectedTime_j,\\sigma_j)"}</MathJax.Node>
                                        </div>
                                    </MathJax.Context>
                                    <p>cdf:Cumulative distribution function</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </DialogModal>
        </React.Fragment>
    )
}
function mapState(state) {
    
}

const actionCreators = {
    
};
const connectedPertModel = connect(mapState, actionCreators)(withTranslate(PertModel));
export { connectedPertModel as PertModel };

// export default PertModel
import React, { useEffect,useState } from 'react'
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from '../../../../common-components';
import { CPT } from '../../risk-dash-board/components/CPT';


const CPTTable = (props) =>{
    const {lists,translate} = props
    useEffect(()=>{
        console.log(lists)
    },[])
    const [state,setState] = useState({
        curentRowDetail:null
    })
    const handleShowDetailInfo = (risk) => {
        setState({
            ...state,
            curentRowDetail: risk,
        });
        window.$(`#modal-detail-info-example-hooks`).modal('show')
    }
    const {curentRowDetail} = state
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-list-cpt`}
                title={translate('process_analysis.cpt_table.conditional_probability_table')}
                hasSaveButton={false}
                size={75}
            >
                
                <CPT
                risk={curentRowDetail && curentRowDetail}
            />
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <div className="box-title">{translate('process_analysis.cpt_table.conditional_probability_table')}</div>
                    </div>
                    <div className="box-body">
                        <div>
                            <table id={'CPT Table'} className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>

                                        <th style={{ width: "70px" }}>{'ID'}</th>
                                        <th>{translate('process_analysis.cpt_table.risk_name')}</th>
                                        <th>{translate('process_analysis.cpt_table.parents')}</th>
                                        <th>{translate('process_analysis.cpt_table.CPT')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(lists && lists.length !== 0) &&
                                        lists.map((risk, index) => (
                                            <tr key={index}>
                                                <td>{risk.riskID}</td>
                                                <td>{risk.name}</td>
                                                <td>{risk.parents.length != 0 ? risk.parents.join(',') : 'None'}</td>
                                                <td style={{ textAlign: 'center' }}><a className="edit text-green" title={translate('manage_risk.detail_info_risk')} onClick={() => handleShowDetailInfo(risk)}>Chi tiết</a></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}
function mapState(state) {
    const { risk, user, riskDistribution, tasks } = state;
    return { risk, user, riskDistribution, tasks }
}

const actionCreators = {

}
const connectedCPTTable = connect(mapState, actionCreators)(withTranslate(CPTTable));
export { connectedCPTTable as CPTTable };
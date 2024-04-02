import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import fastCartesian from 'fast-cartesian';
import {RiskDistributionActions} from '../redux/actions'
import { DialogModal } from '../../../../common-components';
const CPT = (props) => {

    const { translate, risk ,action,tech} = props;
    const [state, setState] = useState({
        title: [],
        cptData: [],
        riskData:[],
        probs:[action?risk.probs.map(r => -1):null]
    })
    const [cptData, setCPTData] = useState()
    const [tfMatrix, setTfMatrix] = useState()
    const {riskData,probs} = state
    useEffect(()=>{
        console.log(tech)
    },[])
    useEffect(() => {
        console.log('riskChange',risk)
        if (props.risk != null) {
            let probsTemp = risk.probs.map(r => -1)
            console.log(probsTemp)
            setState({
                ...state,
                riskData:risk,
                probs:probsTemp
            })
            console.log('setCPT data')
            let data = []
            
            data = data.concat(risk.parentList)
            data = [...data, risk]
            setCPTData(data)
            let temp = []
            for (let i = 0; i < data.length; i++) {
                temp.push([true, false])
            }
            temp = fastCartesian(temp)
            let count = 0
            for (let e of temp) {
                e.push(Math.round(props.risk.probs[count] * 10000)/100 + ' %')
                count++
            }
            setTfMatrix(temp)


        } else {
            console.log('risk null')
        }
    }, [props.risk])
    const clone = (ob) =>{
        return JSON.parse(JSON.stringify(ob))
    }
    const handleNewData =(e,index,riskData) =>{
        let temp = clone(probs)
        temp[index] = parseFloat(e.target.value)/100
        console.log(temp)
        setState({
            ...state,
            probs:temp
        })
        // let temp = JSON.parse(JSON.stringify(riskData))
        // temp.probs[index] = e.target.value
        // console.log(temp)
        // setState({
        //     ...state,
        //     riskData:temp
        // })
    }
    const isFormValidated = ()=>{
        if(probs.length==0) return false
        for(let prob of probs){
            console.log(prob)
            if(prob<0||prob>1) return false
        }
        return true
    }
    const save = ()=>{
        if(isFormValidated()){
            let temp = clone(riskData)
            temp.probs = probs
            temp.tech = 'expert'
            console.log('sendData',temp)
            props.handleSave(temp)
            // props.editRiskDistribution(temp._id,temp)
        }

       
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={action?`modal-${action}`:`modal-detail-info-example-hooks`} isLoading={false}
                title={translate('risk_dash.risk_table.bayes')}
                formID={`form-detail-example-hooks`}
                size={75}
                disableSubmit={!isFormValidated()}
                maxWidth={700}
                hasSaveButton={action&&tech=='expert'?true:false}
                hasNote={false}
                func={save}
            >
                <div className="col-xs-4">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">{action&&tech=='expert'?'CPT':translate('risk_dash.risk_table.cpt_description')}</div>
                        </div>
                        <div className="box-body">
                            {(cptData && cptData.map((r, index) => (
                                <p key={index} style={{fontStyle:'italic'}} ><span style={{fontWeight: 'bold'}}>{r.riskID}</span>{':  ' + r.name}</p>
                            )))}
                            <p style={{fontStyle:'italic'}}><span style={{fontWeight: 'bold'}}>true:</span>   {translate('risk_dash.risk_table.occur')}</p>
                            <p style={{fontStyle:'italic'}}><span style={{fontWeight: 'bold'}}>false:</span>  {translate('risk_dash.risk_table.not_occur')}</p>
                            <p style={{fontStyle:'italic'}}><span style={{fontWeight: 'bold'}}>P(A|B):</span> {translate('risk_dash.risk_table.note')} </p>
                        </div>
                    </div>
                </div>
                <div className="col-xs-8">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">{translate('risk_dash.risk_table.risk_CPT')}</div>
                        </div>
                        <div className="box-body">
                            <div>
                                <table id="risk-cpt-table" className="table table-striped table-bordered table-hover">
                                    <thead>

                                        <tr>

                                            {(cptData && cptData.map((r, index) => (
                                                <th key={index} style={{ textAlign: 'center' }}>{r.riskID}</th>
                                            )))}
                                            <th style={{ textAlign: 'center' }}><p>P({risk&& risk.riskID}{risk&&risk.parents.length>0&&<span>|{risk.parents.join(',')}</span>})</p></th>
                                            {action&&tech=='expert'&&<th>{translate('risk_dash.risk_table.new_value')}</th>}

                                        </tr>
                                    </thead>
                                    <tbody>

                                        {(tfMatrix && tfMatrix.length !== 0) && tfMatrix.map((data, index) => {

                                            return (
                                                <tr key={index}>
                                                    {data.map(d => (<td style={{ textAlign: 'center' }}>{d.toString()}</td>))}
                                                    {action&&tech=='expert'&&(<td><input className={'new'} type = "number" style={{width:50}} key={index} onChange={(e)=>handleNewData(e,index,riskData)}></input></td>)}
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </DialogModal>
        </React.Fragment>
    );
}
const mapAction ={
    editRiskDistribution:RiskDistributionActions.editRiskDistribution
}
const connectCPT = connect(null, mapAction)(withTranslate(CPT));
export { connectCPT as CPT };
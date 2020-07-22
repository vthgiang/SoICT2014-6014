import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';
import { DialogModal } from '../../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';

class ModalDetailKPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: '5dcadf02f0343012f09c1193',
            content: ""
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                idkpiunit: nextProps.idkpiunit,
                date: nextProps.date
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
            this.props.getChildTarget(nextProps.idkpiunit, nextProps.date);
            return false;
        }
        return true;
    }

    handleChangeContent = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                content: id
            }
        })
    }
    formatMonth(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    render() {
        var currentKPI, listchildtarget;
        const { managerKpiUnit, translate } = this.props;
        if (managerKpiUnit.childtarget) {
            listchildtarget = managerKpiUnit.childtarget;
        }

        return (
            <DialogModal
                modalID={`dataResultTask`}
                title={translate('kpi.organizational_unit.management.detail_modal.title') + `${this.formatMonth(this.props.date)}`}
                hasSaveButton={false}
                size={100}>

                <div className="col-xs-12 col-sm-4">
                    <div className="box box-solid" style={{border: "1px solid #ecf0f6", borderBottom: "none"}}>
                        <div className="box-header with-border">
                            <h3 className="box-title" style={{fontWeight: 800}}>{translate('kpi.organizational_unit.management.detail_modal.list_kpi_unit')}</h3>
                        </div>
                        <div className="box-body no-padding">
                            <ul className="nav nav-pills nav-stacked">
                                {typeof listchildtarget !== 'undefined' && listchildtarget !== null && 
                                listchildtarget.map((item, index) =>
                                    <li key={index} className={this.state.content===item._id && "active"}>
                                        <a href="#abc" onClick={() => this.handleChangeContent(item._id)}>
                                            {item.name}
                                            <span className="label label-primary pull-right">{item.arrtarget.length}</span>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>


                <div className="col-xs-12 col-sm-8">
                    {
                        listchildtarget && listchildtarget.map(item => {
                            if (item._id === this.state.content) return <React.Fragment key={item._id}>
                                <h4>{translate('kpi.organizational_unit.management.detail_modal.information_kpi') + `"${item.name}"`}</h4>
                                <div style={{lineHeight: 2}}>
                                    <div>
                                        <label>{translate('kpi.organizational_unit.management.detail_modal.criteria')}</label>
                                        <span> {item.criteria}</span>
                                    </div>
                                    
                                    <div>
                                        <label>{translate('kpi.organizational_unit.management.detail_modal.weight')}</label>
                                        <span> {item.weight}/100</span>
                                    </div>
                                    <div>
                                        <label>{translate('kpi.organizational_unit.management.detail_modal.point_field')}:</label>
                                        <span> {item.approvedPoint === null ? translate('kpi.organizational_unit.management.detail_modal.not_eval') : item.automaticPoint + "-" + item.employeePoint + "-" + item.approvedPoint}</span>
                                    </div>
                                </div>
                                <br/>
                                <br/>

                                <h4>{translate('kpi.organizational_unit.management.detail_modal.list_child_kpi')}</h4>
                                <table id="example1" className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th style={{width:"50px"}} className="col-fixed">{translate('kpi.organizational_unit.management.detail_modal.index')}</th>
                                            <th>{translate('kpi.organizational_unit.management.detail_modal.target_name')}</th>
                                            <th style={{ width: "108px" }}>{translate('kpi.organizational_unit.management.detail_modal.creator')}</th>
                                            <th>{translate('kpi.organizational_unit.management.detail_modal.organization_unit')}</th>
                                            <th>{translate('kpi.organizational_unit.management.detail_modal.criteria')}</th>
                                            <th>{translate('kpi.organizational_unit.management.detail_modal.result')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(typeof item !== "undefined" && item.arrtarget) ?
                                            (item.arrtarget.map((data, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.target.name}</td>
                                                    <td>{data.creator.name}</td>
                                                    <td>{data.organizationalUnit.name}</td>
                                                    <td>{data.target.criteria}</td>
                                                    <td>{data.target.approvedPoint}</td>
                                                </tr>)) : <tr><td colSpan={6}>{translate('kpi.organizational_unit.management.detail_modal.no_data')}</td></tr>

                                        }

                                    </tbody>
                                </table>
                                <div>
                                    <button className="btn btn-primary pull-right">{translate('kpi.organizational_unit.management.detail_modal.export_file')}</button>
                                </div>
                            </React.Fragment>;
                            return true;
                        })
                    }
                </div>
            
            </DialogModal>
            
                       

        )}
}

function mapState(state) {
    const { managerKpiUnit } = state;
    return { managerKpiUnit };
}

const actionCreators = {
    getChildTarget: managerActions.getChildTargetOfCurrentTarget
};
const connectedModalDetailKPI = connect(mapState, actionCreators)(withTranslate(ModalDetailKPI));
export { connectedModalDetailKPI as ModalDetailKPI };
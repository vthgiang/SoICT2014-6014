import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ContractTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                contracts: nextProps.contracts,
                courses: nextProps.courses,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { contracts, courses } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.labor_contract')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}  >
                            <thead>
                                <tr>
                                    <th >{translate('manage_employee.name_contract')}</th>
                                    <th >{translate('manage_employee.type_contract')}</th>
                                    <th >{translate('manage_employee.start_date')}</th>
                                    <th >{translate('manage_employee.end_date_certificate')}</th>
                                    <th >{translate('manage_employee.attached_files')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof contracts !== 'undefined' && contracts.length !== 0) &&
                                    contracts.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.contractType}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? "Chưa có file" :
                                                <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof contracts === 'undefined' || contracts.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.training_process')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.course_name')}</th>
                                    <th>{translate('manage_employee.start_day')}</th>
                                    <th>{translate('manage_employee.end_date')}</th>
                                    <th>{translate('manage_employee.diploma_issued_by')}</th>
                                    <th>{translate('manage_employee.type_education')}</th>
                                    <th>{translate('manage_employee.cost')}</th>
                                    {/* <th style={{ width: '12%' }}>Thời gian cam kết</th> */}
                                    <th>{translate('table.status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof courses !== 'undefined' && courses.length !== 0) &&
                                    courses.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{x.courseType}</td>
                                            <td>{x.offeredBy}</td>
                                            <td>{x.status}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof courses === 'undefined' || courses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};

const tabContract = connect(null, null)(withTranslate(ContractTab));
export { tabContract as ContractTab };
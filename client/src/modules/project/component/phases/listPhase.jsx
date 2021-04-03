import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

const ListPhase = (props) => {
    const { translate } = props;
    const [state, setState] = useState({
        phaseName: "",
        page: 1,
        limit: 5,
    });
    const { phaseName, limit, page } = state;

    const handleChangePhaseName = (e) => {
        setState({
            ...state,
            phaseName: e?.target?.value,
        })
    }
    const handleSubmitSearch = () => {
        props.getExamples({
            phaseName,
            limit,
            page: 1
        });
        setState({
            ...state,
            page: 1
        });
    }

    const lists = [
        {
            projectCodeName: 'SPQ',
            fullName: 'hello',
            progress: '80%',
            listTasks: 'asdasd, asdasd, dddddd',
            duration: '2000 hours'
        },
        {
            projectCodeName: 'SPQ',
            fullName: 'hello2222',
            progress: '50%',
            listTasks: 'asdasd, asdasd, dddddd',
            duration: '2000 hours'
        },
        {
            projectCodeName: 'DATTT',
            fullName: 'hmmmmm',
            progress: '50%',
            listTasks: 'asdasd, asdasd, dddddd',
            duration: '2000 hours'
        },
        {
            projectCodeName: 'MINHTB',
            fullName: 'aaaaaaaaaaaa',
            progress: '10%',
            listTasks: 'asdasd, asdasd, dddddd',
            duration: '2000 hours'
        }
    ]

    return (
        <React.Fragment>
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Tìm kiếm */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('phase.fullName')}</label>
                            <input type="text" className="form-control" name="exampleName" onChange={handleChangePhaseName} placeholder={translate('phase.fullName')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch()}>{translate('manage_example.search')}</button>
                        </div>

                        {/* Button thêm mới */}
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('phase.add_btn_new')}>
                                {translate('phase.add_btn_new')}
                            </button>
                        </div>
                    </div>

                    <table id="project-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('phase.projectCodeName')}</th>
                                <th>{translate('phase.fullName')}</th>
                                <th>{translate('phase.progress')}</th>
                                <th>{translate('phase.listTasks')}</th>
                                <th>{translate('phase.duration')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>
                                    {translate('table.action')}
                                    {/* <DataTableSetting
                                        tableId="example-table"
                                        columnArr={[
                                            translate('manage_example.index'),
                                            translate('manage_example.exampleName'),
                                            translate('manage_example.description'),
                                            "Mã số",
                                        ]}
                                        limit={limit}
                                        hideColumnOption={true}
                                        setLimit={setLimit}
                                    /> */}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map((phase, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 'bold' }}>{phase.projectCodeName}</td>
                                        <td>{phase.fullName}</td>
                                        <td>{phase.progress}</td>
                                        <td>{phase.listTasks}</td>
                                        <td>{phase.duration}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => {
                                                window.location.href = `/project/phase-details`;
                                            }}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => { }}><i className="material-icons">edit</i></a>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => { }}><i className="material-icons" style={{ color: 'red' }}>delete</i></a>
                                            {/* <DeleteNotification
                                                content={translate('manage_example.delete')}
                                                data={{
                                                    id: project._id,
                                                    info: project.name
                                                }}
                                                func={handleDelete}
                                            /> */}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {/* PaginateBar */}
                    {/* {phase && phase.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={phase.data.page}
                        display={lists && lists.length !== 0 && lists.length}
                        total={phase && phase.data.totalDocs}
                        func={setPage}
                    /> */}
                </div>
            </div>
        </React.Fragment>
    )
}
function mapState(state) {
    const { project, user } = state;
    return { project, user }
}
const actions = {}

export default connect(mapState, actions)(withTranslate(ListPhase));
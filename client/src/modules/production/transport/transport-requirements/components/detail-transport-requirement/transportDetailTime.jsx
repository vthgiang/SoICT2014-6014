import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';
import { formatDate } from '../../../../../../helpers/formatDate'


function TransportDetailTime(props) {
    const {listTimeChosen, translate} = props;

    
    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                       
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>{"Số thứ tự"}</th>
                                    <th>{"Ngày"}</th>
                                    <th>{"Chi tiết"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!(listTimeChosen && listTimeChosen.length !== 0) && 
                                    <tr>
                                        {/* <td colSpan={7}>{translate("general.no_data")}</td> */}
                                        <td colSpan={3}>{"Không có dữ liệu"}</td>
                                    </tr>
                                }
                                {
                                    listTimeChosen && listTimeChosen.length !== 0 &&
                                    listTimeChosen.map((x, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{formatDate(x.timeRequest)}</td>
                                                <td>{x.description}</td>
                                            </tr>
                                        )
                                    )}
                            </tbody>
                        </table>                
        </div>

    
    );
}

function mapState(state) {
    return { }
}

const actions = {
}

const connectedTransportDetailTime = connect(mapState, actions)(withTranslate(TransportDetailTime));
export { connectedTransportDetailTime as TransportDetailTime };
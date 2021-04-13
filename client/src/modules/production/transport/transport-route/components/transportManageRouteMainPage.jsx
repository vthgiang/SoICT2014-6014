import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"

// import { transportPlanActions } from "../redux/actions"
// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import './timeLine.css';

function TransportManageRouteMainPage(props) {
    const [ currentPosition, setCurrentPosition ] = useState({});
    const success = position => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setCurrentPosition(currentPosition);
      };
      
      useEffect(() => {
        // navigator.geolocation.getCurrentPosition(success);  
        // const timer = setTimeout(() => {
        //     navigator.geolocation.getCurrentPosition(success);  
        // }, 5000);
        // return () => clearTimeout(timer);
        })
      useEffect(() => {
        console.log(currentPosition, " currentPosition");
      }, [currentPosition])
   return (
            <div className="box-body qlcv">
                <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Chọn kế hoạch</label>
                            <SelectBox
                                id={`select-filter-status-discounts`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={"1"}
                                items={[{value: "0", text: "Chọn kế hoạch"},{value: "1", text: "Kế hoạch 1"}]}
                                // onChange={handleTransportPlanChange}
                            />
                        </div>
                </div>
                <div className={"divTest"}>

                    <table className="tableTest">
                            <tr><th class="headcol">1</th>
                                <td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td>
                                <td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td>
                            </tr>
                            <tr><th class="headcol">2</th><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td></tr>
                            <tr><th class="headcol">3</th><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td></tr>
                            <tr><th class="headcol">4</th><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td></tr>
                            <tr><th class="headcol">5</th><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td></tr>
                            <tr><th class="headcol">6</th><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td><td class="long">QWERTYUIOPASDFGHJKLZXCVBNM</td></tr>
                    </table>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{marginTop: '20px'}}>
                    <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>

                    <table id={"123"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Loại yêu cầu"}</th>
                            <th>{"Địa chỉ bắt đầu"}</th>
                            <th>{"Địa chỉ kết thúc"}</th>
                            <th>{"Người tạo"}</th>
                            <th>{"Trạng thái"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={"1"}>
                            <td>{1}</td>
                            <td>{"123"}</td>
                            <td>{"123"}</td>
                            <td>{"123"}</td>
                            <td>{"123"}</td>
                            <td>{"Chờ phê duyệt"}</td>
                        </tr>
                    </tbody>
                </table>


                    </div>
                    <div className="col-md-12 col-sm-12 col-md-8 col-lg-8 container-time-line">
                        <div className="timeline">
                            <div className="timeline-progress" style={{ width: `10%` }}></div>
                            <div className="timeline-items">
                                {/* {
                                    listStatus && listStatus.length > 0 &&
                                    listStatus.map((o, index) => (
                                        <div key={index} className={`timeline-item ${o.active ? 'active' : ''}`} >
                                            <div className="timeline-contain">{o.name}</div>
                                        </div>
                                    ))
                                } */}
                                <div key={"1"} className={`timeline-item active`} >
                                    <div className="timeline-contain">{"123131323"}</div>
                                </div>
                                <div key={"1"} className={`timeline-item`} >
                                    <div className="timeline-contain" 
                                    // onClick={(e) => this.setCurrentStep(e, index)}
                                    >{"123131323"}</div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <iframe src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyCkVQAqCoJU79mTctNsNmQLy9ME7qiTlfs&q=21.0058354500001,105.842277338"} 
                width="600" 
                height="450" 
                frameborder="0" 
                style={{border:0}} 
                allowfullscreen=""
                loading="lazy" 
                aria-hidden="false" 
                tabindex="0"></iframe>    */}
            </div>
    )
}

function mapState(state) {
    // const allTransportPlans = state.transportPlan.lists;
    // return { allTransportPlans }
}

const actions = {
    // getAllTransportPlans: transportPlanActions.getAllTransportPlans,
}

const connectedTransportManageRouteMainPage = connect(mapState, actions)(withTranslate(TransportManageRouteMainPage));
export { connectedTransportManageRouteMainPage as TransportManageRouteMainPage };
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

import { SortableComponent } from "./testDragDrop/sortableComponent"
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';



function ArrangeOrdinalTransport(props) {
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">Chọn lịch trình</label>
                        <SelectBox
                            id={`select-filter-status-discounts`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: "all", text: "Tất cả lịch trình" },
                                { value: "1", text: "Lịch trình 1" },
                            ]}
                            // onChange={this.handleQueryDateChange}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div>
					<fieldset className="scheduler-border" style={{ height: "100%" }}>
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<legend className="scheduler-border">Xe...</legend>
							<div>
								<label>sadasd</label>
							</div>
						</div>
						
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				    		<SortableComponent/>
						</div>
					</fieldset>
                    <SortableComponent/>
                </div>
                <SortableComponent/>
            </div>
            
        </React.Fragment>
    )
}

function mapState(state) {
}

const actions = {
}

const connectedArrangeOrdinalTransport = connect(mapState, actions)(withTranslate(ArrangeOrdinalTransport));
export { connectedArrangeOrdinalTransport as ArrangeOrdinalTransport };
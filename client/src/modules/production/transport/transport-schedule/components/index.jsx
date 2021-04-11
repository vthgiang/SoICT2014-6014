import React, { Component } from "react";
import { forceCheckOrVisible, formatDate, LazyLoadComponent } from '../../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ArrangeVehiclesAndGoods } from './arrangeVehiclesAndGoods'
import { SortableComponent } from './testDragDrop/sortableComponent'

class TransportSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#arrange-vehicles-and-goods" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Sắp xếp xe và hàng hóa"}</a></li>
                    <li><a href="#arrange-ordinal-transport" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Thứ tự vận chuyển"}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="arrange-vehicles-and-goods">
                        <LazyLoadComponent
                        >
                            <ArrangeVehiclesAndGoods />
                        </LazyLoadComponent>
                    </div>
                    <div className="tab-pane" id="arrange-ordinal-transport">
                        <LazyLoadComponent
                        >
                            <SortableComponent />
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransportSchedule;
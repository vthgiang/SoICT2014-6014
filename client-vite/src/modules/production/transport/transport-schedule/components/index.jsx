import React, { Component } from 'react'
import { forceCheckOrVisible, formatDate, LazyLoadComponent } from '../../../../../common-components'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ArrangeVehiclesAndGoods } from './arrangeVehiclesAndGoods'
import { SortableComponent } from './testDragDrop/sortableComponent'
import { ArrangeOrdinalTransport } from './arrangeOrdinalTransport'
import { ManagementTable } from './managementTable'

class TransportSchedule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: ''
    }
    // this.reloadOrdinalTransport=this.reloadOrdinalTransport.bind(this);
  }
  reloadOrdinalTransport = () => {
    this.setState({
      data: new Date()
    })
  }
  render() {
    return (
      // <div className="nav-tabs-custom">
      //     <ul className="nav nav-tabs">
      //         <li className="active"><a href="#arrange-vehicles-and-goods" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Sắp xếp xe và hàng hóa"}</a></li>
      //         <li><a href="#arrange-ordinal-transport" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Thứ tự vận chuyển"}</a></li>
      //     </ul>
      //     <div className="tab-content">
      //         <div className="tab-pane active" id="arrange-vehicles-and-goods">
      //             <LazyLoadComponent
      //             >
      //                 <ArrangeVehiclesAndGoods
      //                     reloadOrdinalTransport={this.reloadOrdinalTransport}
      //                 />
      //             </LazyLoadComponent>
      //         </div>
      //         <div className="tab-pane" id="arrange-ordinal-transport">
      //             <LazyLoadComponent
      //             >
      //                 <ArrangeOrdinalTransport
      //                     key={this.state.data}
      //                 />
      //             </LazyLoadComponent>
      //         </div>
      //     </div>
      // </div>
      <div className='box' style={{ minHeight: '450px' }}>
        <div className='box-body'>
          <ManagementTable />
        </div>
      </div>
    )
  }
}

export default TransportSchedule

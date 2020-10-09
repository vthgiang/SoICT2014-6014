import React, { Component } from 'react';
import { DialogModal, SelectBox, ButtonModal } from '../../../../../common-components'

 class ManufacturingOrderCreateForm extends Component {
  render() {
    return (
        <React.Fragment>
        <ButtonModal modalID={`modal-create-sales-order`} button_name={'Thêm mới đơn sản xuất'} title={'Thêm mới đơn sản xuất'} />
        </React.Fragment>
    );
  }
}


export default ManufacturingOrderCreateForm;
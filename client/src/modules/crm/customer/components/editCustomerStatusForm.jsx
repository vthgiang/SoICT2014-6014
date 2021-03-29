import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox } from '../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';

EditCustomerStatusForm.propTypes = {

};

function EditCustomerStatusForm(props) {
    return (
        <React.Fragment>
            <div
            // id={id} className="tab-pane active"
             >
                <h3>Thay đổi trạng thái khách hàng</h3>
               
            </div>

        </React.Fragment>
    )
}

export default (withTranslate(EditCustomerStatusForm));
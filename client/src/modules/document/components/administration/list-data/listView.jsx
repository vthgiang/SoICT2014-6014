import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DateTimeConverter } from '../../../../../common-components';

class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { translate } = this.props;
        const { views } = this.props.docs;
        return (
            <React.Fragment>
                <DialogModal
                    size={50}
                    modalID={`modal-list-view`}
                    title={`${translate('document.views')} ${this.props.docs.name}`}
                    hasSaveButton={false}
                >
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>{translate('document.viewer')}</th>
                                <th>{translate('document.time')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                views.length > 0 ?
                                    views.map(view =>
                                        <tr key={view._id}>
                                            <td>{view.viewer.name}</td>
                                            <td><DateTimeConverter dateTime={view.time} type="DD-MM-YYYY" /></td>
                                        </tr>
                                    ) :
                                    null
                            }
                        </tbody>
                    </table>
                </DialogModal>
            </React.Fragment>

        )
    }
}

export default connect(null, null)(withTranslate(ListView));
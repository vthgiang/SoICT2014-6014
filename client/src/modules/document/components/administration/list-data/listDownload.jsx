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
        console.log('nameeeeeee', this.props.docs.name)
        const { downloads } = this.props.docs;
        return (
            <React.Fragment>
                <DialogModal
                    size={50}
                    modalID={`modal-list-download`}
                    title={`${translate('document.downloads')} ${this.props.docs.name}`}
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
                                downloads.length > 0 ?
                                    downloads.map(download =>
                                        <tr key={download._id}>
                                            <td>{download.downloader.name}</td>
                                            <td><DateTimeConverter dateTime={download.time} type="DD-MM-YYYY" /></td>
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
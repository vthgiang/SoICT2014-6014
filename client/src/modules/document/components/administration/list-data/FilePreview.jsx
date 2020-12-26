import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import FilePreviewer from 'react-file-previewer';
import { DialogModal } from '../../../../../common-components';
class FilePreview extends Component {


    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { translate } = this.props;
        const { file } = this.props;
        console.log('filleee', file)
        return (
            <React.Fragment>
                <DialogModal
                    size={50}
                    modalID={`modal-file-preview`}
                    title='Preview'
                    hasSaveButton={false}
                    hasNote={false}
                >

                    <div>
                        <h1>My App</h1>
                        <FilePreviewer
                            file={{
                                data: file,
                                mimeType: 'application/pdf',
                                name: 'sample.pdf' // for download
                            }}
                        />
                    </div>
                </DialogModal>
            </React.Fragment>
        )
    }
}

export default connect(null, null)(withTranslate(FilePreview));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import DocumentInformation from '../../user/documents/documentInformation';

class ListDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.domainId !== prevState.domainId) {
            return {
                ...prevState,
                documents: nextProps.documents,
            }
        } else {
            return null;
        }
    }

    render() {
        const documents = this.props.documents;
        console.log('ttttt', this.props.documents)
        return (
            <React.Fragment>
                <div id="list-document">
                    <div className="form-group">
                        {documents && documents.map(document =>
                            <div>{document.name}</div>
                        )}
                    </div>

                </div>
            </React.Fragment>
        )
    }

}


const mapStateToProps = state => state;



export default connect(mapStateToProps, null)(withTranslate(ListDocument));
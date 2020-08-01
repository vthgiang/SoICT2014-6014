import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ServerResponseAlert extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    checkTranslateExist = (code) => {
        const subCode = code.split('.');

        if (subCode.length === 1) {
            return code ? true : false;
        } else if (subCode.length > 1) {
            let codeData = subCode[0];

            if (!codeData) {
                return false;
            } else {
                for (let i = 1; i < subCode.length; i++) {
                    codeData = codeData + '.' + subCode[i];

                    if (!codeData) {
                        return false;
                    }
                }
            }

            return true;
        }
    }

    render() {
        const { type = null, title = null, content = [] } = this.props;

        return (
            <React.Fragment>
                <h3>{title}</h3>
                {
                    content.map((message, i) => {
                        return this.checkTranslateExist(message) ?
                            <p key={message}>{content.length > 1 ? `${i + 1}. ` : null}{message}</p> :
                            <p key={message}>{content.length > 1 ? `${i + 1}. ` : null}{message}</p>;
                    })
                }
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { } = state;
    return {};
}

export default ServerResponseAlert;
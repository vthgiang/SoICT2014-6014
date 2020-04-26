import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ServerResponseAlert extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    checkTranslateExist = (translate, code) => {
        const subCode = code.split('.');
        if(subCode.length === 1 ){

            return translate(code) !== undefined ? true : false;
        }else if(subCode.length >= 2){

            const codeData = subCode[0];
            if(translate(codeData) === undefined) return false;
            for (let i = 1; i < subCode.length; i++) {
                codeData = codeData.concat(codeData, `.${subCode[i]}`);
                if(translate(codeData) === undefined) return false;
            }

            return true;
        }
    }

    render() { 
        const { translate } = this.props;
        const { type=null, title=null, content=[] } = this.props;

        return ( 
            <React.Fragment>
                <h3 className="text-center">
                    {translate(title)}
                </h3>
                <ul>
                    {
                        content.map(message => {
                            return this.checkTranslateExist(translate, message) ?
                                <li key={message}>{translate(message)}</li>:
                                <li key={message}>{message}</li>;
                        })
                    }
                </ul>
            </React.Fragment>
        );
    }
}
 
const mapStateToProps = state => state;

export default connect( mapStateToProps )( withTranslate(ServerResponseAlert) );
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { IntlActions } from 'react-redux-multilingual';

class Language extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {translate} = this.props;
        return ( 
            <React.Fragment>
                <li>
                    <button
                        className="btn"
                        data-toggle="control-sidebar"
                        title={translate('language')}
                        style={{
                            padding: '15px 15px 15px 15px',
                            backgroundColor: '#605CA8',
                            color: 'white'
                        }}>
                        <i className="fa fa-language"></i>
                    </button>
                </li>
                <div className="control-sidebar control-sidebar-light" style={{ display: 'none', marginTop: '52px', width: '158px' }}>
                    <div style={{ marginTop: '-40px' }}>
                        <button onClick={this.props.setLanguageEnglish} style={{border: 'none', backgroundColor: '#F9FAFC'}}>
                            <i>
                                <img src="/lib/en.png" className="img-circle" alt="img" style={{ width: '30px', height: '30px', marginLeft: '5px' }} />
                                <span className="badge">EN</span>
                            </i>
                        </button>
                        <button onClick={this.props.setLanguageVietNam} style={{border: 'none', backgroundColor: '#F9FAFC'}}>
                            <i>
                                <img src="/lib/vn.png" className="img-circle" alt="img" style={{ width: '30px', height: '30px', marginLeft: '5px' }} />
                                <span className="badge">VN</span>
                            </i>
                        </button>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => { //lưu các users lên store
    return {
        setLanguageVietNam: () => {
            localStorage.setItem('lang', 'vn');
            dispatch(IntlActions.setLocale('vn'));
        },
        setLanguageEnglish: () => {
            localStorage.setItem('lang', 'en');
            dispatch(IntlActions.setLocale('en'));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Language));
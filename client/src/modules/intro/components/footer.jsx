import React from 'react';
import { connect } from 'react-redux';
import { withTranslate, IntlActions } from 'react-redux-multilingual';

const Footer = ({ translate }) => {
    return (
        <React.Fragment>
            <section id="dx-footer" className="dx-container">

                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h4 className="text-center text-bold">{translate('intro.footer.about_us.title')}</h4>
                        <p>{translate('intro.footer.about_us.content')}</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h4 className="text-center text-bold">{translate('intro.footer.care.title')}</h4>
                        <ul className="dx-footer care">
                            <li className="dx-footer care item p-center-h">
                                <i className="fa fa-square"></i>
                                {translate('intro.footer.care.content.company')}<a href="https://vnist.vn/" style={{ marginLeft: 2 }}> VNIST </a>
                            </li>
                            <li className="dx-footer care item p-center-h">
                                <i className="fa fa-square"></i>
                                {translate('intro.footer.care.content.research')}
                            </li>
                        </ul>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h4 className="text-center text-bold">{translate('intro.footer.media.title')}</h4>
                        <span className="p-center media">
                            <img className="dx-content1 image" src='/library/dx/images/facebook.png' />
                            <img className="dx-content1 image" src='/library/dx/images/youtube.png' />
                            <img className="dx-content1 image" src='/library/dx/images/twitter.png' />
                            <img className="dx-content1 image" src='/library/dx/images/pinterest.png' />
                            <img className="dx-content1 image" src='/library/dx/images/google-plus.png' />
                        </span>
                    </div>
                </div>

            </section>

            <footer className="dx-footer dx-container">
                <div className="copyright">{translate('intro.footer.copyright')}</div>
            </footer>
        </React.Fragment>
    )
}

export default connect()(withTranslate(Footer));
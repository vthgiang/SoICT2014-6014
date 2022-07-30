import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

const QuantityStatistic = (props) => {
    const { biddingPackagesManager, biddingContract, project } = props;

    const numofBP = biddingPackagesManager.totalList;
    const numOfContract = biddingContract.totalList;
    const numOfPrj = biddingContract.listBiddingContractStatistic.filter(x => !x.project === false)?.length ?? project.data.totalDocs;

    return (
        <div className='row'>
            <div className="col-md-3 col-sm-6 form-inline">
                <div className="info-box">
                    <span className="info-box-icon bg-yellow">
                        <i className="fa fa-archive"></i>
                    </span>
                    <div className="info-box-content">
                        <span className="info-box-text">Tổng số gói thầu</span>
                        {/* <a className="info-box-number" style="cursor: pointer; font-size: 20px;">1</a> */}
                        <span style={{ fontWeight: 600, fontSize: "20px" }}>{numofBP}</span>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-sm-6 form-inline">
                <div className="info-box">
                    <span className="info-box-icon bg-aqua">
                        <i className="fa fa-handshake-o"></i>
                    </span>
                    <div className="info-box-content">
                        <span className="info-box-text">Tổng số hợp đồng đấu thầu</span>
                        <span style={{ fontWeight: 600, fontSize: "20px" }}>{numOfContract}</span>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-sm-6 form-inline">
                <div className="info-box">
                    <span className="info-box-icon bg-green">
                        <i className="fa fa-tasks"></i>
                    </span>
                    <div className="info-box-content">
                        <span className="info-box-text">Tổng số dự án</span>
                        <span style={{ fontWeight: 600, fontSize: "20px" }}>{numOfPrj}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityStatistic));
export { connectedComponent as QuantityStatistic }

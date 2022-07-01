import React from 'react'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { getStorage } from '../../../../config'
import { ProjectActions } from '../../../project/projects/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { BiddingContractActions } from '../../bidding-contract/redux/actions'
import { BiddingPackageManagerActions } from '../../bidding-package/biddingPackageManagement/redux/actions'
import { BidAndProjectStatistic } from './biddingAndProjectStatistic'
import { BiddingInProcessStatistic } from './biddingInProcessStatistic'
import { BiddingPriceAndProjectBudgetDashboard } from './biddingPriceAndProjectBudgetDashboard'
import { QuantityStatistic } from './quantityStatistic'
import { ContractBidProjectRelation } from './statisticContractBidAndProjectRelation'

const BiddingDashboard = (props) => {
    const { biddingPackagesManager, biddingContract, project } = props;

    const userId = getStorage("userId");
    useEffect(() => {
        props.getProjectsDispatch({ calledId: "paginate", page: 1, perPage: 10000, userId, projectName: "" });
        props.getProjectsDispatch({ calledId: "user_all", userId });
        props.getAllBiddingPackage({ callId: "contract", name: '', status: 3, page: undefined, limit: undefined });
        props.getAllBiddingPackage({ name: '', page: undefined, limit: undefined });
        props.getListBiddingContract({ callId: "statistic", page: undefined, limit: undefined });
        props.getListBiddingContract({ page: undefined, limit: undefined });

    }, []);

    const numOfBP = biddingPackagesManager.listActiveBiddingPackage.filter(x => x?.status === 3).length || 0;

    return (
        <div>
            <QuantityStatistic />
            {numOfBP >= 10 && <span style={{ fontWeight: 600, color: "red", lineHeight: 2 }}>* Hiện đang có 10 gói thầu đang thực hiện, hãy tạm dừng tìm kiếm gói thầu mới để đảm bảo tiến độ *<br /></span>}
            <ContractBidProjectRelation />
            <BiddingPriceAndProjectBudgetDashboard />
            <BidAndProjectStatistic />
            <BiddingInProcessStatistic />
        </div>
    )
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {
    getListBiddingContract: BiddingContractActions.getListBiddingContract,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllUser: UserActions.get,
    getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(BiddingDashboard));
export { connectedComponent as BiddingDashboard }
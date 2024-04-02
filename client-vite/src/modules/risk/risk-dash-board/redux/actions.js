import { RiskDistributionConstants } from './constants';
import { RiskDistributionServices } from './services';

export const RiskDistributionActions = {
    getRiskDistributions,
    getParentsOfRisk,
    bayesianNetworkAutoConfig,
    deleteRiskDistribution,
    getRiskDistributionByName,
    updateProb,
    editRiskDistribution,
    changeTech,
    updateAlg
};
function changeTech(data) {
    return dispatch => {
        dispatch({
            type: RiskDistributionConstants.CHANGE_ALGORITHMS_SUCCESS,
            payload:data
           
        })
    
    }
}
function updateAlg() {
    return dispatch => {
        dispatch({
            type: RiskDistributionConstants.UPDATE_ALG_REQUEST,
            
        })
        RiskDistributionServices.updateAlg()
            .then(res => {
                dispatch({
                    type: RiskDistributionConstants.UPDATE_ALG_SUCCESS,
                    payload: res.data.content
                })
            }).catch(err => {
                dispatch({
                    type: RiskDistributionConstants.UPDATE_ALG_FAILURE
                })
            })
    
    }
}
function editRiskDistribution(id, data) {
    return dispatch => {
        dispatch({
            type: RiskDistributionConstants.EDIT_RISK_DISTRIBUTION_REQUEST
        });
        RiskDistributionServices.editRiskDistribution(id, data)
            .then(res => {
                dispatch({
                    type: RiskDistributionConstants.EDIT_RISK_DISTRIBUTION_SUCCESS,
                    payload: res.data.content
                })
            }).catch(err => {
                dispatch({
                    type: RiskDistributionConstants.EDIT_RISK_DISTRIBUTION_FAILURE
                })
            })
    }
}
function deleteRiskDistribution(id) {
    return dispatch => {
        dispatch({
            type: RiskDistributionConstants.DELETE_RISK_DISTRIBUTION_REQUEST
        });
        RiskDistributionServices.deleteRiskDistribution(id)
            .then(res => {
                dispatch({
                    type: RiskDistributionConstants.DELETE_RISK_DISTRIBUTION_SUCCESS,
                    payload: res.data.content
                })
            }).catch(err => {
                dispatch({
                    type: RiskDistributionConstants.DELETE_RISK_DISTRIBUTION_FAILURE
                })
            })
    }
}
function getRiskDistributions(data) {
    return dispatch => {
        dispatch({
            type: RiskDistributionConstants.GET_RISK_DISTRIBUTION_REQUEST
        });
        RiskDistributionServices.getRiskDistributions(data)
            .then(res => {

                dispatch({
                    type: RiskDistributionConstants.GET_RISK_DISTRIBUTION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskDistributionConstants.GET_RISK_DISTRIBUTION_FAILURE,
                });
            })
    }
}
function getParentsOfRisk(data) {
    return dispatch => {
        dispatch({
            type: RiskDistributionConstants.GET_PARENTS_OF_RISK_REQUEST
        });
        RiskDistributionServices.getParentsOfRisk(data)
            .then(res => {
                console.log('res data', res.data.content)
                dispatch({
                    type: RiskDistributionConstants.GET_PARENTS_OF_RISK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskDistributionConstants.GET_PARENTS_OF_RISK_FAILURE,
                });
            })
    }
}
function bayesianNetworkAutoConfig(data) {
    return dispatch => {
        dispatch({
            type: RiskDistributionConstants.BAYESIAN_NETWORK_AUTO_CONFIG_REQUEST
        });
        RiskDistributionServices.bayesianNetworkAutoConfig(data)
            .then(res => {

                dispatch({
                    type: RiskDistributionConstants.BAYESIAN_NETWORK_AUTO_CONFIG_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskDistributionConstants.BAYESIAN_NETWORK_AUTO_CONFIG_FAILURE,
                });
            })
    }
}
function getRiskDistributionByName(id) {
    return dispatch => {
        dispatch({
            type: RiskDistributionConstants.GET_RISK_DISTRIBUTION_BY_ID_REQUEST
        });
        RiskDistributionServices.getRiskDistributionByName(id)
            .then(res => {

                dispatch({
                    type: RiskDistributionConstants.GET_RISK_DISTRIBUTION_BY_ID_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskDistributionConstants.GET_RISK_DISTRIBUTION_BY_ID_FAILURE,
                });
            })
    }
}
function updateProb() {
    return dispatch => {
        dispatch({
            type: RiskDistributionConstants.UPDATE_PROBABILITY_REQUEST
        });
        RiskDistributionServices.updateProb()
            .then(res => {

                dispatch({
                    type: RiskDistributionConstants.UPDATE_PROBABILITY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: RiskDistributionConstants.UPDATE_PROBABILITY_FAILURE,
                });
            })
    }
}
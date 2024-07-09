// const ConfigSettingService = require('../modules/kpi/kpi-allocation/config-setting/configSetting.service');
// const OrganizationalUnitDashboard = require('../modules/kpi/organizational-unit/dashboard/dashboard.service')
const  SalesOrder =require('../modules/production/order/sales-order/salesOrder.service')

const call_service = async (link, params) => {
  switch(link[0]){
    case 'orderService': {
      if(link[1]==='countSalesOrder') {
        const {userId,query,portal}=params
        return await SalesOrder.countSalesOrder(userId,query,portal);
      }
    }
    default:
      return
  }
};
const internalCall = async (link, params) => {
  try {
    console.log(params.params);
    const response = await call_service(link.split('.'), params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  internalCall,
};

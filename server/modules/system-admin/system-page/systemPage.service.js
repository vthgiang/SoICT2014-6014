const { links } = require('../../../middleware/servicesPermission');

const getSystemPageApis = async (data) => {
    const { path, method, description, page = 1, perPage = 30 } = data
  
    const pageUrl = data.pageUrl;
    const pageApis = links.find(pageLink => pageLink.url === pageUrl)?.apis;

    return pageApis;
}

exports.SystemPageServices = {
    getSystemPageApis,
}
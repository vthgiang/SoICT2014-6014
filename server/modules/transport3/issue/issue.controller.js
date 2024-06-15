const IssueService = require('./issue.service');
const Log = require(`../../../logs`);

// Lấy danh sách các vấn đề
exports.getIssues = async (req, res) => {
  try {
    const issues = await IssueService.getIssues(req.portal, req.query);
    await Log.info(req.user.email, 'GET_ISSUES', req.portal);
    res.status(200).json({
      status: 200,
      messages: ['Lấy danh sách vấn đề thành công'],
      data: issues
    });
  } catch (error) {
    await Log.error(req.user.email, 'GET_ISSUES', req.portal);
    res.status(400).json({
      status: 400,
      messages: ['Lấy danh sách vấn đề thất bại'],
    });
  }
}

// Tạo mới 1 vấn đề
exports.createIssue = async (req, res) => {
  try {
    const newIssue = await IssueService.createIssue(req.portal, req.body);
    await Log.info(req.user.email, 'CREATE_ISSUE', req.portal);
    res.status(200).json({
      status: 200,
      messages: ['Tạo vấn đề thành công'],
      data: newIssue
    });
  } catch (error) {
    await Log.error(req.user.email, 'CREATE_ISSUE', req.portal);
    res.status(400).json({
      status: 400,
      messages: ['Tạo vấn đề thất bại'],
    });
  }
}

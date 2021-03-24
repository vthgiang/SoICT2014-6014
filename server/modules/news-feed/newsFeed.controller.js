const NewsFeedService = require('./newsFeed.service');
const Logger = require(`../../logs`);

exports.getNewsFeed = async (req, res) => {
    try {
        let data = {
            ...req.query,
            currentNewsfeed: req.query.currentNewsfeed ? req.query.currentNewsfeed : [],
            userId: req.user._id
        }
        let newsFeeds = await NewsFeedService.getNewsFeed(req.portal, data);

        await Logger.info(req.user.email, 'get_all_user_time_sheet_success', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_all_user_time_sheet_success'],
            content: newsFeeds
        })
    } catch (error) {
        await Logger.error(req.user.email, 'get_all_user_time_sheet_faile', req.portal)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_user_time_sheet_faile'],
            content: error
        })
    }
}

/**
 * Tạo comment cho newsfeed
 */
 exports.createComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let newsfeed = await NewsFeedService.createComment(req.portal, req.params?.newsFeedId, req.body, files);
        await Logger.info(req.user.email, ` create comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['create_comment_success'],
            content: newsfeed
        })
    } catch (error) {
        await Logger.error(req.user.email, ` create comment kpi `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['create_comment_fail'],
            content: error
        });
    }
}

/**
 * 
 *Sửa comment trong trang create KPI employee
 */
exports.editComment = async (req, res) => {
    try {
        let files = [];
        if (req.files !== undefined) {
            req.files.forEach((elem, index) => {
                let path = elem.destination + '/' + elem.filename;
                files.push({ name: elem.originalname, url: path })

            })
        }
        let newsfeed = await NewsFeedService.editComment(req.portal, req.params, req.body, files);
        await Logger.info(req.user.email, ` edit comment news feed `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['edit_comment_success'],
            content: newsfeed
        })
    } catch (error) {
        await Logger.error(req.user.email, ` edit comment news feed `, req.portal)
        res.status(400).json({
            success: false,
            messages: ['edit_comment_fail'],
            content: error
        });
    }
}

/**
 * Xóa comment trong trang create KPI employee
 */
exports.deleteComment = async (req, res) => {
    try {
        let newsfeed = await NewsFeedService.deleteComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete comment news feed`, req.portal)
        res.status(200).json({
            success: false,
            messages: ['delete_comment_success'],
            content: newsfeed
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete comment news feed `, req.portal)
        res.status(200).json({
            success: false,
            messages: ['delete_comment_fail'],
            content: error
        })
    }
}

/**
 * Xóa file của comment
 */
exports.deleteFileComment = async (req, res) => {
    try {
        let newsfeed = await NewsFeedService.deleteFileComment(req.portal, req.params);
        await Logger.info(req.user.email, ` delete file comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_success'],
            content: newsfeed
        })
    } catch (error) {
        await Logger.error(req.user.email, ` delete file comment `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['delete_file_comment_fail'],
            content: error
        })
    }
}
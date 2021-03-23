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
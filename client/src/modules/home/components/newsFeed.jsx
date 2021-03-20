import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import moment from 'moment';
import 'moment/locale/en-nz';
import 'moment/locale/vi';

import { ToolTip, SlimScroll } from '../../../common-components';
import { getStorage } from '../../../config';

import { homeActions } from '../redux/actions';

import './newsFeed.css';

function NewsFeed(props) {
    const { translate, newsFeeds } = props;
    const [lang, setLang] = useState(getStorage('lang'))
    const [time, setTime] = useState(new Date());
    const [state, setState] = useState({
        loadMore: false,
        showDescription: {}
    })
    const { loadMore, showDescription } = state;

    const activeSlimScroll = () => {
        window.$('#newsfeed-body').ready(function () {
            SlimScroll.removeVerticalScrollStyleCSS('newsfeed-body');
            SlimScroll.addVerticalScrollStyleCSS("newsfeed-body", 800, true);
        })
    }

    useEffect(() => {
        setLang(getStorage('lang'));

        const list = document.getElementById('newsfeed-body')

        // list has fixed height
        list.addEventListener('scroll', (e) => {
            const el = e.target;
            if(el.scrollTop + el.clientHeight === el.scrollHeight) {
                setState({
                    ...state,
                    loadMore: true
                });
            }
        })

        props.socket.io.on('news feed', data => {
            props.receiveNewsFeed(data);
        });

        const timer = setInterval(() => setTime(new Date()), 120000);
        
        return () => {
            props.socket.io.off('news feed');
            clearInterval(timer);
        }
    }, []);

    useEffect(() => {
        activeSlimScroll();
    })

    useEffect(() => {
        props.getNewsfeed({ currentNewsfeed: newsFeeds?.newsFeed ? newsFeeds.newsFeed.map(item => item?._id) : [] });
        setState({
            ...state,
            loadMore: false
        });
    }, [loadMore]);
  
    
  
    // useEffect(() => {
    //   const list = document.getElementById('list');
  
    //   if(list.clientHeight <= window.innerHeight && list.clientHeight) {
    //     setLoadMore(true);
    //   }
    // }, [props.state]);

    const handleShowComment = () => {

    }

    const handleShowDetail = (id) => {
        let showDescriptionTemp = showDescription;
        showDescriptionTemp[id] = !showDescription[id]

        setState({
            ...state,
            showDescription: showDescriptionTemp
        })
    }

    return (
        <React.Fragment>
            <div className="box" id="newsfeed">
                <div className="box-header with-border">
                    <div className="box-title">Newsfeed</div>
                </div>
                <div id="newsfeed-body">
                    { newsFeeds?.newsFeed?.length > 0 
                        && newsFeeds?.newsFeed?.map((item, index) =>
                            <div className="description-box" key={item?._id + index} style={{ borderRadius: '10px', margin: '10px 10%', backgroundColor: index % 2 ? '#ffffff' : '#f9f9f9' }}>
                                <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + item.creator?.avatar)} alt="User Image" />
                                <div className="newsfeed-content-level1">
                                    <a style={{ cursor: "pointer" }}>{item.creator?.name} </a>
                                    <div style={{ fontSize: '13px' }}>{moment(item?.createdAt).locale(lang === 'en' ? 'en-nz' : 'vi').fromNow()}</div>
                                </div>

                                {/* Nội dung */}
                                <div>
                                    <div><strong>{item?.title && parse(item?.title)}</strong></div>
                                    { item?.task && <div><strong>{translate('task.task_management.detail_link')}:</strong> <a href={`/task?taskId=${item?.task?._id}`} target="_blank">{item?.task?.name}</a></div>}
                                    {showDescription[item?._id] 
                                        && <ToolTip dataTooltip={[item?.description && parse(item?.description)]} type={'latest_history'} title={false}/>
                                    }
                                </div>

                                {/* Hành động */}
                                <ul className="list-inline tool-level1">
                                    <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowComment()}><i className="fa fa-comments-o margin-r-5"></i> {translate('task.task_perform.comment')}</a></li>
                                    <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowDetail(item?._id)}>{showDescription[item?._id] ? 'Ẩn chi tiết' : 'Chi tiết'}</a></li>
                                </ul>
                            </div>
                        )
                    }
                    {newsFeeds?.newsfeedLoading && <div style={{ margin: '10px 10%' }}>Đang tải dữ liệu ...</div>}
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { newsFeeds, socket } = state;
    return { newsFeeds, socket }
}
const actions = {
    getNewsfeed: homeActions.getNewsfeed,
    receiveNewsFeed: homeActions.receiveNewsFeed
}

const connectedNewsFeed = connect(mapState, actions)(withTranslate(NewsFeed));
export { connectedNewsFeed as NewsFeed }

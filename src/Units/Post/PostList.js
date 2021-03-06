/*
多个帖子列表,带有添加新帖功能
props:{
    wdRef:野狗posts路径
}
*/
import { Component } from 'react';
import h from 'react-hyperscript';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import FontA from 'react-fa';

import Post from '../../Units/Post/Post';
import MyUpload from '../../Utils/MyUpload';

const style = theme => ({
    newPost: {
        width: 360,
        background: '#EEE',
        height: 48,
        position: 'absolute',
        bottom: 0,
        right: 0,
        display: 'flex',
    },
    newPostUrl: {
        width: 360,
        background: '#EEE',
        height: 24,
        position: 'fixed',
        bottom: 48,
        right: 0,
        display: 'flex',
    },
    newPostBtn: {},
    newPostUrlBtn: {
        width: '100%',
        minHeight: 20,
        padding: 6,
        fontSize: 10,
        fontWeight: 400,
    },
    newImgBtn: {
        width: 48,
        minWidth: 48,
        borderTop: '1px solid #CCC',
    },
    newPostText: {
        flex: 1,
        height: 46,
        padding: '0 16px',
        fontSize: '0.9rem',
    },
});

//元件
class com extends Component {
    state = {
        posts: null,
        newPostText: '',
        newPostUrl: '',
        currentUser: null,
    };

    wdAuthListen = null;
    wdDataListen = null;
    wdDataRef = null;
    componentDidMount = async function() {
        let that = this;
        const wdRef = that.props.wdRef;
        if(!wdRef) return;

        //读取跟帖数据
        let ref = that.wdDataRef = global.$wd.sync().ref(wdRef);
        let query = ref.orderByChild('ts').limitToFirst(10);
        that.wdDataListen = query.on('value', (shot) => {
            let posts = shot.val();
            that.setState({ posts: posts });
        });
        this.wdAuthListen = global.$wd.auth().onAuthStateChanged(function(user) {
            var cuser = global.$wd.auth().currentUser;
            if(!cuser) return;
            that.setState({ currentUser: cuser });
        });
    };

    componentWillUnmount = () => {
        try {
            this.wdAuthListen();
            this.wdDataRef.off('value', this.wdDataListen);
        } catch(err) {};
    };


    //创建新帖子
    addPost = () => {
        let that = this;

        if(!global.$wd.auth().currentUser) {
            global.$alert.fn.show('您还没有登录', '请点右上角图标进行登录或注册');
            return;
        };
        if(that.state.newPostUrl && !global.$conf.regx.postUrl.test(that.state.newPostUrl)) {
            global.$alert.fn.show('链接格式错误', '请检查确认以http开头的完整链接');
            return;
        };
        if(!global.$conf.regx.postText.test(that.state.newPostText)) {
            global.$alert.fn.show('标题格式错误', '请确认字符数量3～256个');
            return;
        };

        let curUser = global.$wd.auth().currentUser;
        const wdRef = that.props.wdRef;
        if(!wdRef) return;

        //屏蔽按钮避免重复发送
        that.setState({ sending: true });
        setTimeout(() => {
            that.setState({ sending: false });
        }, 3000);

        let newPost = {
            url: that.state.newPostUrl,
            text: that.state.newPostText,
            author: curUser.uid,
            ts: global.$wd.sync().ServerValue.TIMESTAMP,
        };

        let ref = this.wdDataListen = global.$wd.sync().ref(wdRef);
        ref.push(newPost).then((shot) => {
            global.$snackbar.fn.show('发布成功！', 2000);
            that.setState({
                newPostUrl: '',
                newPostText: '',
            });
        }).catch((err) => {
            global.$snackbar.fn.show(`发布失败:${err.message}`, 3000);
        });
    };


    render() {
        let that = this;
        const css = that.props.classes;

        let itemArr = [];
        let posts = that.state.posts || {};
        let postArr = [];

        for(var key in posts) postArr.push(posts[key]);
        postArr = postArr.sort((a, b) => { return b.ts - a.ts });
        postArr.forEach((item, index) => {
            itemArr.push(
                h(Post, {
                    post: item
                }),
            );
        });

        //添加新帖子
        let addPostDom = h(Grid, {
            item: true,
            xs: 12,
            md: 8,
            className: css.newPostBox,
        }, [
            that.state.newPostUrl ? h('div', { className: css.newPostUrl }, [
                h(Button, {
                    className: css.newPostUrlBtn,
                    color: 'primary',
                    onClick: () => {
                        that.setState({ newPostUrl: null });
                    },
                }, [
                    h(FontA, { name: 'close' }),
                    h('span', { style: { marginLeft: 8 } }, that.state.newPostUrl),
                ]),
            ]) : undefined,
            h('div', { className: css.newPost }, [
                h(MyUpload, {
                    raised: true,
                    freeze: 10,
                    children: h(FontA, { name: 'photo' }),
                    style: {
                        height: 48,
                        width: 48,
                        minWidth: 48,
                        borderTop: '1px solid #CCC',
                    },
                    success: (file, err, res) => {
                        that.setState({ newPostUrl: `http://${file.url}` });
                    },
                }),
                h('input', {
                    className: css.newPostText,
                    placeholder: '留个言吧～',
                    value: that.state.newPostText,
                    onChange: (e) => {
                        var val = e.target.value;
                        that.setState({
                            newPostText: val,
                        });
                    },
                }),
                 h(Button, {
                    raised: true,
                    disabled: !that.state.currentUser || that.state.sending,
                    color: 'primary',
                    className: css.newPostBtn,
                    onClick: () => {
                        that.addPost();
                    },
                }, '发布'),
            ]),
        ]);
        itemArr.push(addPostDom);

        return h(Grid, {
            container: true,
            style: { marginBottom: 64 }
        }, itemArr);
    }
};


com.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(style)(com);

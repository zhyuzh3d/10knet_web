/*
任意用户头像和名称按钮，点击跳转到用户详情页面
props:{
    userId:不能为空，
    size:'xs,sm,md,lg',
    asButton:是否作为按钮使用，默认跳转到用户想详情页
    nameStyle:文字样式
    iconStyle:图标样式
}
*/
import { Component } from 'react';
import h from 'react-hyperscript';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import merge from 'deepmerge';

import ButtonBase from 'material-ui/ButtonBase';

const style = theme => ({
    user: {
        verticalAlign: 'middle',
        paddingLeft: 0,
    },
    userImg: {
        background: '#EEE',
        border: '1px solid #CCC',
        verticalAlign: 'middle',
        marginRight: theme.spacing.unit,
    },
    userName: {
        fontWeight: 200,
        color: '#888',
        display: 'inline-block',
        marginRight: theme.spacing.unit,
    },
});

const varSize = {
    xs: {
        img: 8,
        font: 10,
    },
    sm: {
        img: 16,
        font: 12,
    },
    md: {
        img: 24,
        font: 12,
    },
    lg: {
        img: 32,
        font: 14,
    },
    xlg: {
        img: 48,
        font: 18,
    },
};

//元件
class com extends Component {
    state = {
        user: {},
    };

    //获取用户基本信息
    getUserInfo = (uid) => {
        let that = this;
        let userId = uid || that.props.userId;
        global.$wd.sync().ref(`user/${userId}`).once('value', (shot) => {
            let user = merge({ uid: userId }, shot.val() || {});
            !that.hasUnmounted && that.setState({ user: user });
        });
    };


    //界面完成后的初始化函数-退出现有账号
    componentWillMount = async function() {
        this.getUserInfo();
    };

    componentWillReceiveProps = async function(props) {
        props.userId !== this.props.userId && this.getUserInfo(props.userId);
    };

    hasUnmounted = false;
    componentWillUnmount = () => {
        this.hasUnmounted = true;
    };

    //渲染实现
    render() {
        let that = this;
        const css = that.props.classes;
        let size = varSize[that.props.size || 'sm'];
        let asBtn = that.props.asButton === false ? false : true;
        let user = that.state.user;

        return h(asBtn ? ButtonBase : 'div', {
            className: css.user,
            onClick: asBtn ? () => {
                global.$router.changePage('UserDetailPage', { userId: user.uid });
            } : undefined,
        }, [
            h('img', {
                src: user.photoURL ? `http://${user.photoURL}-thumb64` : global.$conf.defaultIcon,
                className: css.userImg,
                style: merge(that.props.iconStyle || {}, {
                    width: size.img,
                    height: size.img,
                    borderRadius: size.img,
                }),
            }),
            h('div', {
                className: css.userName,
                style: merge(that.props.nameStyle || {}, {
                    fontSize: size.font,
                    verticalAlign: 'middle',
                }),
            }, user.displayName || '未命名'),
        ]);
    }
};


com.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(style)(com);

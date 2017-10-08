import { Component } from 'react';
import h from 'react-hyperscript';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import style from './_style';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
//import Toolbar from 'material-ui/Toolbar';
//import IconButton from 'material-ui/IconButton';
//import FontA from 'react-fa';
//import Tooltip from 'material-ui/Tooltip';
//import Typography from 'material-ui/Typography';
//import Menu, { MenuItem } from 'material-ui/Menu';
//import Avatar from 'material-ui/Avatar';

import MainAppBar from '../../Units/MainAppBar/MainAppBar';
import PostList from '../../Units/Post/PostList';

//元件
class com extends Component {
    state = {
        snackbarText: '..tip..',
        snackbarOpen: false,
        title: '资源管理中心',
        contentHeight: window.innerHeight - 48,
    };

    //界面初始化之前的函数
    componentWillMount = async function() {};

    //界面完成后的初始化函数:判断用户是否登录，创建userMenu
    componentDidMount = async function() {
        let that = this;
        window.addEventListener('resize', () => {
            that.setState({ contentHeight: window.innerHeight });
        });
    };

    //渲染实现
    render() {
        document.getElementsByTagName('title')[0].innerHTML = '控制台';
        let that = this;
        //const css = this.props.classes;

        //内容区
        let content = h(Grid, {
            container: true,
            style: { height: that.state.contentHeight, overflow: 'auto' },
        }, [
            h(PostList,{wdRef:'asset/-KvrUBUztaRDOOcugei4/post'}),
            /*h(Button, {
                raised: true,
                color: 'primary',
                onClick: () => {
                    global.$router.changePage('AssetListPage');
                },
            }, '我的资源列表'),*/
//            h('div'),
          ]);

        //最终拼合
        return h(Grid, { container: true }, [
            h(MainAppBar, { title: that.state.title }),
            h(Grid, { container: true, style: { height: 80 } }),
            content,
        ]);
    }
};

com.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(style)(com);

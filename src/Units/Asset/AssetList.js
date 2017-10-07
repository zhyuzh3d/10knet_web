/*
根据用户uid获取其资源列表
props:{
    userId:如果为空则自动调取当前用户的uid使用
}
*/
import { Component } from 'react';
import h from 'react-hyperscript';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import List, { ListItem } from 'material-ui/List';
import FontA from 'react-fa';
import Moment from 'react-moment';

import style from './_style';

//元件
class com extends Component {
    state = {
        assets: null,
    };

    //界面生成之前，读取数据
    componentWillMount = async function() {
        let that = this;
        let userId = that.props.userId;

        global.$wd.auth().onAuthStateChanged((user) => {
            let curUser = global.$wd.auth().currentUser;
            if(curUser && !userId) {
                userId = curUser.uid;
            };
            if(userId) that.getAssets(userId);
        });
    };

    //根据uid获取资源列表
    getAssets = (userId) => {
        let that = this;
        let ref = global.$wd.sync().ref('asset')
        let query = ref.orderByChild('author').equalTo(userId).limitToFirst(100);
        query.on('value', (shot) => {
            that.setState({ assets: shot.val() });
        });
    };

    //界面完成后的初始化函数-退出现有账号
    componentDidMount = async function() {};

    //渲染实现
    render() {
        let that = this;
        const css = that.props.classes;
        const AssetTypes = global.$conf.assetTypes;

        let assetElArr = h(Grid, { item: true, className: css.loading }, [
            h(FontA, { name: 'spinner', spin: true }),
        ]);
        let assets = that.state.assets;

        if(assets) {
            assetElArr = [];
            let assetsArr = [];
            for(var key in assets) {
                assets[key].id = key;
                assetsArr.push(assets[key])
            };

            //排序
            assetsArr = assetsArr.sort((a, b) => { return b.ts - a.ts });
            assetsArr.forEach((item, index) => {
                let el = h(ListItem, {
                    className: css.asset,
                    button: true,
                    onClick: () => {
                        //window.open(item.url);
                        global.$router.changePage('AssetDetailPage', { assetId: item.id });
                    },
                }, [
                    h(Grid, { container: true, align: 'center' }, [
                        h(Grid, {
                            item: true,
                            className: css.assetIcon
                        }, h(FontA, { name: AssetTypes[item.type].icon })),
                        h(Grid, {
                            item: true,
                            className: css.assetText,
                        }, [
                            h('div', { className: css.assetTitle }, item.title),
                            h(Moment, {
                                className: css.assetTime,
                                format: 'YY.MMDD.hhmm'
                            }, item.ts),
                        ]),
                        h(Grid, {
                            item: true,
                            className: css.assetIcon2
                        }, h(FontA, { name: 'chevron-right' })),
                    ]),
                ]);
                assetElArr.push(el);
                assetElArr.push(h('div', { className: css.divider }));
            });
        };

        return h(List, { style: { padding: 0 } }, assetElArr);
    }
};


com.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(style)(com);
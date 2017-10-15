/*素材的详情页，带有留言板
sotre{
    assetId,
    basketId,如果存在，就读取basket/arr/assetId数据；如果不存在就读取src/assetId源数据
}
*/
import { Component } from 'react';
import h from 'react-hyperscript';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

import NavBar from '../../Units/MainAppBar/NavBar';
import AssetDetail from '../../Units/Asset/AssetDetail';
import PostList from '../../Units/Post/PostList';


import style from './_style';

//元件
class com extends Component {
    state = {
        title: '素材详情',
        contentHeight: window.innerHeight - 48,
    };


    componentDidMount = async function() {
        window.addEventListener('resize', this.setContentSize);
    };

    setContentSize = () => {
        this.setState({ contentHeight: window.innerHeight });
    };

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.setContentSize);
    };

    //渲染实现
    render() {
        let that = this;
        const css = that.props.classes;
        var assetId = global.$store('AssetDetailPage', 'assetId');
        var basketId = global.$store('AssetDetailPage', 'basketId');

        let content = h(Grid, {
            container: true,
            style: { height: that.state.contentHeight },
        }, [
            h(AssetDetail, {
                assetId: assetId,
                basketId: basketId,
            }),
            h('div', { className: css.postsLabel }, '最近跟帖'),
            h(PostList, { wdRef: `src/${assetId}/post` }),
        ]);

        //最终拼合
        let contentStyle = {
            padding: 16,
            height: that.state.contentHeight,
            overflowY: 'auto',
            paddingBottom: 128,
        };
        return h(Grid, { container: true, }, [
            h(NavBar, { title: that.state.title }),
            h(Grid, { container: true, style: { height: 80 } }),
            h(Grid, { container: true, justify: 'center' },
                h(Grid, { item: true, xs: 12, sm: 10, md: 8, style: contentStyle }, content),
            ),
        ]);


    }
};


com.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(style)(com);

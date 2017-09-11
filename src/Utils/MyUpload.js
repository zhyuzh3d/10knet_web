/**
 * 上传文件到七牛的控件
 * props:{
 *  color:'inherit'|'primary'|'accent'...按钮颜色
 *  raised:false|true,按钮样式
 *  label:'上传文件',按钮的文字
 *  icon:'insert_drive_file',按钮的图标
 *  nameRegx:'^\.+$',对文件名进行验证的正则表达式
 *  accept:'',接受的文件MIME类型（仅browser有效）
 *  children:'上传文件',按钮文字，可以是任何dom元素或数组如[h(HomeIcon),h('span','上传home')]
 * },
 */

import React from 'react';
import Request from 'superagent';
import { Component } from 'react';
import h from 'react-hyperscript';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

var $fn = {};
const _style = theme => ({
    label: {
        fontSize: 18,
    }
});

class MyComponent extends Component {
    genInputDom = () => {
        let that = this;
        return h('input', {
            type: "file",
            accept: (that.props.accept || ''),
            ref: (dom) => { that.state.inputDom = dom },
            onChange: (event) => { that.onChange(event.target.files) },
        })
    };

    state = {
        reactVersion: React.version, //去除unuse警告
        file: [],
        inputDom: this.genInputDom(),
    };

    //请求token发起上传
    start = $fn.start = (file) => {
        Request('localhost:3300/api/qiniu/uploadTokenRand', function(err, res) {
            console.log('>>>', res);
        });
    };

    //取消上传
    cancel = $fn.cancel = (ele) => {

    };

    //按钮被点击
    onClick = () => {
        this.state.inputDom && this.state.inputDom.click();
    };

    //文件被选择，选择文件改变
    onChange = (files) => {
        let that = this;
        var file = (FileList.length >= 0) ? files[0] : null;
        if(!file) return;

        //延迟以清理原有input，避免重复选择文件不能触发事件
        that.setState({ inputDom: null });
        setTimeout(() => {
            that.setState({ inputDom: that.genInputDom() });
        }, 100);

        //检查文件格式
        var regx = new RegExp(this.props.nameRegx || '^.+$');
        if(!regx.test(file.name)) {
            if(global.$alert) {
                global.$alert.fn.show('文件格式错误', '上传被取消，请重新选择');
            } else {
                alert('文件格式错误', '上传被取消，请重新选择');
            };
            return;
        };

        //启动上传动作
        that.start(file);
    };

    //渲染实现
    render() {
        let that = this;
        let css = that.props.classes;

        let ipt = h('input#ipt', {
            type: 'file',
            textInput: null,
        });

        return h('div', {}, [
            h(Button, {
                color: that.props.color || 'inherit',
                raised: that.props.raised || false,
                onClick: () => {
                    this.onClick();
                },
            }, that.props.children || h('span', '上传文件')),
            that.state.inputDom, //实际输入，每次自动重新生成
        ]);
    };
};

MyComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
MyComponent = withStyles(_style)(MyComponent);
MyComponent.fn = $fn;

export default MyComponent;

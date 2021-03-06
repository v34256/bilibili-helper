/**
 * Author: Ruo
 * Create: 2018/9/4
 * Description:
 */
import _ from 'lodash';
import store from 'store';
import {isLogin} from 'Utils';
import {PERMISSION_STATUS} from 'Utils';

/**
 * 特性
 * 规范启用一个特性/功能需要涉及到的一系列方法
 */
export class Feature {

    /**
     * @param name {string} 配置的名称
     * @param kind {string} 配置的列表划分，在渲染设置页面时根据该值在相对应的列表中自动渲染，如：主站，直播，其他等
     * @param permissions {Object}
     * @param settings {object} 特性的额外配置选项，如过滤列表的配置信息
     * @param dependencies {array}
     */
    constructor({name, kind, permissions = {}, settings = {}, dependencies = []}) {
        this.name = _.upperFirst(name);
        this.storeName = `bilibili-helper-${this.name}`;
        this.kind = kind;
        this.permissions = permissions;
        this.settings = {...settings, kind, name};
        this.initialed = false;
        this.launching = false;
        this.dependencies = dependencies;
        //this.init();
    }

    /**
     * 初始化 - 位于装载过程之前
     * 1.检查(启动)配置
     * 2.鉴权
     * 3.配置初始化
     * @return {Promise} true 表示初始化成功 返回字符串表示初始化失败说明
     */
    init = (settings) => {
        return new Promise((resolve) => {
            this.initSetting(settings);
            const {on} = this.settings;
            if (on !== undefined) { // 检查启用状态，如果没有启动则不会执行后续的装载和启动过程
                if (on === false) {
                    console.warn(`Feature ${this.name} OFF`);
                    resolve(false);
                } else {
                    this.checkPermission().then((res) => {
                        const {pass, msg} = res;
                        if (pass) {
                            this.addListener();
                            this.initialed = true;
                            console.log(`Feature init completed: ${this.name}`);
                            resolve(this);
                        } else {
                            console.error(`Feature ${this.name}: ${msg}`);
                            this.settings.on = false;
                            this.settings.toggle = false;
                            resolve(false);
                        }

                    });
                }
            } else { // 没有启动配置
                console.error(`No settings names ${_.upperFirst(this.name)}`);
                resolve(false);
            }
        });
    };

    // 初始化配置
    initSetting = (sets) => {
        const settings = sets || store.get(this.storeName) || {}; // 缓存配置
        this.settings = Object.assign({}, this.settings, settings);
        store.set(this.storeName, this.settings);
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.commend === 'setSetting' && _.upperFirst(message.feature) === this.name) {
                // 同步设置 background 里 memory 和 localStorage 中的设置
                this.setSetting(message.settings);
                sendResponse(true);
            } else if (message.commend === 'getSetting' && _.upperFirst(message.feature) === this.name) {
                sendResponse(this.settings);
            }
        });
    };

    // 获取配置
    getSetting = (featureName) => {
        if (featureName === this.name || !featureName) return this.settings || {};
        else {
            const name = _.upperFirst(featureName);
            return chrome.extension.getBackgroundPage().FeatureManager.features[name].getSetting();
        }
    };

    // 设置配置
    setSetting = (settings) => {
        //if (this.settings.toggle === false) return;
        if (this.initialed === false || settings.on !== this.settings.on) { // 没有初始化过 或者 总启动状态发生变化时
            if (settings.on === true) {
                if (!this.initialed) void this.init(settings);
                else this.launch();
            } else this.pause();
        }
        this.settings = settings;
        store.set(this.storeName, settings);
        this.afterSetSetting(settings);
    };

    // 设置之后运行的钩子函数
    afterSetSetting = () => {};

    // 启动 - 装载过程之后
    launch = () => {
        //console.warn(`Feature ${_.upperFirst(this.name)}'s launch Function is empty!`);
        return;
    };

    // 暂停 - 启动后关闭功能时调用
    pause = () => {
        //console.error(`Feature ${_.upperFirst(this.name)}'s pause Function is empty!`);
        return;
    };

    // 添加监听器
    addListener = () => {
        //console.warn(`Feature ${_.upperFirst(this.name)}'s addListener Function is empty!`);
        return;
    };

    // 鉴权
    checkPermission = () => {
        return new Promise(resolve => {
            if (_.isEmpty(this.permissions)) resolve({pass: true, msg: ''});// 没有设置需要检查的权限，则无条件通过
            let [pass, msg] = [true, '']; // 通过状态

            const checkPromise = _.map(this.permissions, (permission, permissionName) => {
                return new Promise((resolve1) => {
                    if (!permission) { // 未知权限类型
                        [pass, msg] = [false, `Undefined permission: ${permissionName}`];
                    } else if (permission.check && !permission.value) {// 已经检查过 且 没有检查通过 直接返回之前的检查结果
                        [pass, msg] = [permission.value, permission.errorMsg];
                    } else { // 权限没有检查过
                        switch (permissionName) {
                            case 'login': {
                                return isLogin().then((login) => {
                                    pass = login ? true : false;
                                    msg = !pass ? PERMISSION_STATUS['login'].errorMsg : '';
                                    resolve1({pass, msg});
                                });
                                break;
                            }
                            case 'notifications': {
                                chrome.notifications.getPermissionLevel((level) => {
                                    pass = level === 'granted' ? true : false;
                                    msg = PERMISSION_STATUS['notifications'].errorMsg;
                                });
                                break;
                            }
                        }
                    }
                    resolve1({pass, msg});
                });
            });
            Promise.all(checkPromise).then(checkResults => {
                let p = true, message = '';
                _.each(checkResults, ({pass, msg}) => {
                    if (!pass) {
                        p = false;
                        message = msg;
                    }
                });
                resolve({pass: p, msg: message});
            });
        });
    };
}
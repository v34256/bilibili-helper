/**
 * Author: DrowsyFlesh
 * Create: 2018/10/10
 * Description: 该文件用于注入到视频播放页面，主要作用是创建DOM钩子，用于装载一些需要在其内显示的功能控件
 */
//import React from 'react';
//import {initialByInterval, initialByObserver} from 'Utils';
import 'Styles/scss/video.scss';
import {UIManager} from 'Libs/UIManager';
import {consoleLogo} from 'Utils';

new UIManager('video');
consoleLogo();

//
//initialByObserver({
//    container: [
//        '#bangumi_detail .func-module',
//        '#arc_toolbar_report .ops',
//        '#arc_toolbar_report',
//    ],
//    kind: 'video',
//    feature: 'video',
//});

//initialByInterval({
//
//})
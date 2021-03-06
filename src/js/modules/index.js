/**
 * Author: Ruo
 * Create: 2018-06-12
 * Description: 功能点打包入口
 */
// 然后再加载子类
import {DynamicCheck, DynamicCheckUI} from './dynamicCheck';
import {VideoAnchor, VideoAnchorUI} from './videoAnchor';
import {DoSign} from './doSign';
import {Treasure, TreasureUI} from './treasure';
import {GoogleAnalytics} from './googleAnalytics';
import {Debug} from './debug';
import {Danmu, DanmuUI} from './danmu';
import {Popup, PopupUI} from './popup';
import {Menu, MenuUI} from './menu';
import {ChatFilter, ChatFilterUI} from 'Modules/chatFilter';
import {VideoDownload, VideoDownloadUI} from 'Modules/videoDownload';
//import {VideoQualitySelect} from './videoQualitySelect';
import {PictureInPicture, PictureInPictureUI} from 'Modules/pictureInPicture';
import {VideoWiden, VideoWidenUI} from 'Modules/videoWiden';
import {VideoSubtitleDownload, VideoSubtitleDownloadUI} from 'Modules/videoSubtitleDownload';
import {CheckVersion} from 'Modules/checkVersion';
import {Silver2coin} from 'Modules/silver2coin';
import {QuickSearch} from 'Modules/quickSearch';
import {VideoHideDanmu, VideoHideDanmuUI} from 'Modules/videoHideDanmu';

export const Features = {
    Debug,
    Popup,
    Treasure,
    Menu,
    GoogleAnalytics,
    VideoAnchor,
    Danmu,
    DynamicCheck,
    ChatFilter,
    VideoDownload,
    DoSign,
    //VideoQualitySelect,
    PictureInPicture,
    VideoWiden,
    VideoSubtitleDownload,
    CheckVersion,
    Silver2coin,
    QuickSearch,
    VideoHideDanmu,
};

export const UIs = {
    PopupUI,
    TreasureUI,
    MenuUI,
    VideoAnchorUI,
    DanmuUI,
    DynamicCheckUI,
    ChatFilterUI,
    VideoDownloadUI,
    PictureInPictureUI,
    VideoWidenUI,
    VideoSubtitleDownloadUI,
    VideoHideDanmuUI,
};
import React from "react";
import css from './css/PilotLamp.module.scss';
import classNames from "classnames";
export default function PilotLamp({className,text,status,color,panelStyle}:{
    className?:string, //自定义css
    text:string, //显示的文字
    status?:boolean //灯状态
    ,color?:string, //灯颜色
    panelStyle?:1|2 //面板样式
}){
    let panelStyle2 = panelStyle === 2
    if(color){
        if(color.startsWith('@')){
            if(color === '@red'){
                color = '#FF0000'
            }else if(color === '@green2'){
                color = '#00FF00'
            }else if(color === '@blue'){
                color = '#0000FF'
            }else if(color === '@yellow'){
                color = '#FFFF00'
            }else if(color === '@green'){
                color = '#B7FF00'
            }else{
                color = '#B7FF00'
            }
        }
    }else{
        color = '#B7FF00'
    }
    return <div className={classNames(css.lamp,className,panelStyle2?css.lampstyle2:null)} style={{}}>
        <div className={classNames(css.light,status?'':css.off)} style={{
            background:color,
            boxShadow:status?`0px 0px 10px ${color}`:'',
            filter:status?'':'brightness(0.3)',
            }}></div>
        <span className={css.text}>{text}</span>
    </div>
}
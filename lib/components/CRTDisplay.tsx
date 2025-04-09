import classNames from 'classnames';
import css from './css/CRTDisplay.module.scss';
import { useEffect,useState } from 'react';
let animation = css.animation
export default function CRTDisplay({className,children,density,animation,scanLine=true}:{
    className?:string, //自定义css
    children:any,
    density?:number,
    animation?:boolean,
    scanLine?:boolean
}){
    density = density || 1
    return <div className={classNames(css.CRTDisplay,className,{[css.animation]:animation})}>
        <div className={scanLine?css.scanLine:''} style={{transform:`scale(${density})`}}></div>
        <div className={css.content}>
        {children}
        </div>
    </div>
}

export function ProgressBar({className,progress,width}:{
    className?:string,
    progress:number
    width?:number
}){
    return <div className={classNames(css.progressBar,className,animation)} style={{width:width}}>
        <div className={classNames(css.progress,animation)} style={{maxWidth:progress+'%'}}></div>
    </div>
}
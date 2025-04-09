'use client'
import { useEffect,useState } from 'react';
import css from './css/StatusLight.module.scss';
import classNames from 'classnames';
export default function StatusLight({className,text,fontSize = 90,color,status="off",serif = false,blinkFrequency=500,fix}:{
    className?:string, //自定义css
    text:string, //显示的文字
    fontSize?:number //字体大小
    ,color?:string, //灯箱颜色
    status?:"off"|"on"|"blink" //灯箱状态
    serif?:boolean, //是否是衬线字体
    blinkFrequency?:number //闪烁频率
    fix?:{ //文字位置修正·
        x:number,
        y:number
    }
}){
    // serif = serif || false
    let [light,setLight] = useState(false)
    let x = 0
    let y = 0
    if(fix){
        x = fix.x
        y = fix.y
    }
    // useEffect(()=>{
    //     if(status === 'blink'){
    //         //直接css
    //         let light_stat = false
    //         let interval = setInterval(()=>{
    //             light_stat = !light_stat
    //             setLight(light_stat)
    //         },blinkFrequency)
    //         return ()=>{
    //             alert('clear')
    //             clearInterval(interval)}
    //     }else{
    //         setLight(status === 'on')
    //     }
    // },[status,blinkFrequency])
    // const width = fontWidth + margin + 'px'
    return <div className={
            classNames(css.statusLight,className,css[status])} 
            style={{padding:`${fontSize/5}px ${fontSize/2}px`,borderRadius:fontSize/14+'px',backgroundColor:color,
        animationDuration:blinkFrequency*2+'ms'}
            }>
        <span className={
            classNames(css.text,serif?css.serif:css.sansSerif)} 
            style={{fontSize:fontSize+'px',transform:`translate(${x}px,${y}px)`}}>{text}</span>
    </div>
}
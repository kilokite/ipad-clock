
'use client'
import Image from "next/image";
import { use, useState,useEffect } from "react";
import styles from "./page.module.scss";
import Altimeter, { NumberBars } from "@/lib/components/Altimeter";
import StatusLight from "@/lib/components/StatusLight";
import LibLogo from "@/lib/components/LibLogo";
import { FullScreen, useFullScreenHandle ,FullScreenHandle} from "react-full-screen";
import PilotLamp from "@/lib/components/PilotLamp";
import Button from "@/lib/components/Button";
import Panel, { Hole } from "@/lib/components/Panel";
import StatusButton from "@/lib/components/StatusButton";
import CRTDisplay, { ProgressBar } from "@/lib/components/CRTDisplay";
function Li({id,index,children}:{id:number,index:number,children:any}){
  return <li className={id==index?styles.select:''}>{children}</li>
}
function CRT({handle}:{handle:FullScreenHandle}){
  let [progress, setProgress] = useState(0)
  let [page,setPage] = useState(0)
  let [fullScreenStatus,setFullScreenStatus] = useState(false)
  let [select,setSelect] = useState(0)
  useEffect(() => {
    let interval =  setInterval(() => {
      setProgress(progress = progress + 5)
      if(progress > 100){
        clearInterval(interval)
        setPage(1)
      }
    }
      , 100)
    return () => {
      clearInterval(interval)
    }  
  }, [])
  function handleFullScreen(){
    if(fullScreenStatus){
      handle.exit()
    }else{
      handle.enter()
    }
    setFullScreenStatus(!fullScreenStatus)
  }
  let content
  if(page === 0){
    content = <div>
      <div className={styles.crt}>正在加载。。。</div>
      <ProgressBar progress={progress} width={200}></ProgressBar>
      </div>
  }else if(page === 1){
    content = <div className={styles.crt}>
      <h2>欢迎使用:菜单</h2>
      <ul className={styles.menu} style={{'--select':select} as any}>
        <Li id={0} index={select}>事件直播</Li>
        <Li id={1} index={select}>清单</Li>
        <Li id={2} index={select}>状态</Li>
      </ul>
    </div>
  }
  return <div className={styles.CRTContainer}>
    <CRTDisplay scanLine={true} density={1} className={styles.CRT}>
    {content}
    </CRTDisplay>
    <div className={styles.ctrlPanel}>
      <p> <StatusButton onClick={handleFullScreen} status={fullScreenStatus?'on':'off'} width={1}><div className={styles.content}>Full</div>screen</StatusButton>
      <StatusButton onClick={()=>{setSelect(select-1)}} status="blink" width={1} noStatus>↑</StatusButton>
      <StatusButton onClick={()=>{}} status="off" width={1}><div className={styles.content}>Set</div></StatusButton></p>
      <p> <StatusButton onClick={()=>{}} status="blink" width={1} noStatus>←</StatusButton>
      <StatusButton onClick={()=>{}} status="blink" width={1} noStatus><div className={styles.content}>Enter</div></StatusButton>
      <StatusButton onClick={()=>{}} status="blink" width={1} noStatus>→</StatusButton></p>
      <p> <StatusButton onClick={()=>{}} status="off" width={1}><div className={styles.content}>Set</div></StatusButton>
      <StatusButton onClick={()=>{setSelect(select+1)}} status="blink" width={1} noStatus>↓</StatusButton>
      <StatusButton onClick={()=>{}} status="off" width={1}><div className={styles.content}>Set</div></StatusButton></p>
    </div>
  </div>
}
export default function Home() {
  let [status, setStatus] = useState(false)
  const handle = useFullScreenHandle();
  return (
    <FullScreen handle={handle} className="">
      <div className={styles.container}>
        <div className={styles.timeContainer}>
          <div className={styles.menu}>
            <PilotLamp text="Power Input" status={status} color="@green" className={styles.pilotLamp} panelStyle={2}></PilotLamp>
            <Panel className={styles.panel}>
              <div className={styles.statusLightContainer}>
                <StatusLight text="斷電" fontSize={40} color="red" status="blink" serif={true}></StatusLight>
                <StatusLight text="NET" fontSize={40} color="#00e100" status="on" blinkFrequency={300}></StatusLight>
              </div>
              <StatusLight text="服务正常" fontSize={40} color="#00e100" status="on" blinkFrequency={300}></StatusLight>
              <Hole className={styles.hole}>
                powered by zskt
              </Hole>
            </Panel>
          </div>
          <Altimeter className={styles.time} />
        </div>
        <Panel className={styles.buttonContainer}>
          {/* <Button onClick={() => setStatus(!status)} color="@red-main" shape="circleCorner">批准</Button>
          <Button onClick={() => setStatus(!status)} color="@green-main">拒絕</Button>
          <Button onClick={() => { }} shape="circle"><img src="/play.png" alt="" className={styles.buttonImg} /></Button>
          <Button onClick={handle.enter} color="@red-dark">全屏</Button>
          <Button onClick={()=>setStatus(!status)} color="@green">Switch</Button> */}
          <CRT handle={handle}></CRT>
        </Panel>
        <div> <LibLogo className={styles.logo}></LibLogo> <Button onClick={()=>{}}>Success</Button></div>
      </div>
    </FullScreen>
  );
}

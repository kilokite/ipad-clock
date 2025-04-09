import { useEffect } from "react";
type status = "off"|"on"|"blink"
export default function Control(status:status,blinkFrequency:number,setLight:any){
    useEffect(()=>{
        if(status === 'blink'){
            //直接css
            let light_stat = false
            let interval = setInterval(()=>{
                light_stat = !light_stat
                setLight(light_stat)
            },blinkFrequency)
            return ()=>{
                alert('clear')
                clearInterval(interval)}
        }else{
            setLight(status === 'on')
        }
    },[status,blinkFrequency])
}
export {Control}
export type {status}
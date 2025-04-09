'use client'
import css from './css/Altmeter.module.scss'
import classNames from 'classnames';
import { useEffect, useState } from 'react';
function NumberBars({ num, position }: { num: number, position: number }) {
  let pow = Math.pow(10, position) / 10
  num = (num / pow) % 10
  let margin = -1 * (121 * num)
  console.log('margin',margin)
  return <div className={css.numberBars}>
    <div className={css.line}></div>
    <div className={css.group} style={{ transform:`translateY(${margin}px)` }}>
      <p>9</p>
      <p>0</p>
      <p>1</p>
      <p>2</p>
      <p>3</p>
      <p>4</p>
      <p>5</p>
      <p>6</p>
      <p>7</p>
      <p>8</p>
      <p>9</p>
    </div>
  </div>
}
function PointerDisplay({ num }: { num: number }) {
  return <div className={css.pointerDisplay}>
    <TinyNumberBars num={num} position={2} className={css.tinyNumber}></TinyNumberBars>
    <TinyNumberBars num={num} position={1} className={css.tinyNumber2}></TinyNumberBars>
  </div>
}
function TinyNumberBars({ num, position, className }: { num: number, position: number, className?: string }) {
  useEffect(() => {
    // alert(window.devicePixelRatio)
  },[])
  let margin
  let pow = Math.pow(10, position) / 10
  num = (num / pow) % 10
    margin = -1 * (18* num)
  return <div className={classNames(css.tinyNumber, className)} style={{ transform:`translateY(${margin}px)`}}>
    <p>9</p>
    <p>0</p>
    <p>1</p>
    <p>2</p>
    <p>3</p>
    <p>4</p>
    <p>5</p>
    <p>6</p>
    <p>7</p>
    <p>8</p>
    <p>9</p>
  </div>
}
export { NumberBars }
export default function Altimeter({className}:{className?:string}) {
  let [num, setNum] = useState(0);
  function add() {
    setNum(num + 1)
  }
  function sub() {
    setNum(num - 1)
  }
 
  useEffect(() => {
    let li = setTimeout(() => {
      const now = new Date();
      let time = now.getHours() * 10000 + now.getMinutes() * 100 + now.getSeconds()
      // console.log(time)
      setNum(time)
    }, 1000)
    return () => clearTimeout(li)
  }, [num])
  return <div className={classNames(css.container,className)}>
    <div className={css.bigNumberDisplay}>
      <NumberBars num={num} position={6}></NumberBars>
      <NumberBars num={num} position={5}></NumberBars>
      <NumberBars num={num} position={4}></NumberBars>
      <NumberBars num={num} position={3}></NumberBars>
      <div className={css.shadow}></div>
      <div className={classNames(css.shadow, css.bottom)}></div>
    </div>
    <div>
      <PointerDisplay num={num}></PointerDisplay>
      {/* <button onClick={sub}>-</button>
      <input type="text" value={num} onChange={e => setNum(Number(e.target.value))} />
      <button onClick={add}>+</button> */}
      <img className={css.logo} src='/studioLogo.svg'/>
    </div>
  </div>;
}

import classNames from 'classnames';
import css from './css/Button.module.scss';
import colorHandle from '../color';
export default function Button({ className, onClick, children ,color,shape='square'}: {
    className?: string,
    onClick: () => void,
    children?: any,
    color?: string,
    shape?:'circleCorner'|'circle'|'square' 
}) {
    let buttonCss = css[shape];
    console.log(css)
    console.log('render')
    color = colorHandle(color)
    return <button className={classNames(className, css.button,buttonCss)} onClick={onClick} style={{backgroundColor:color}}>
        <div className={classNames(css.material)}>{children}</div>
    </button>
}
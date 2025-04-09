import classNames from 'classnames'
import css from './css/StatusButton.module.scss'
import { Children } from 'react'
import {Control,status} from '../lightControl'
export default function StatusButton({ status, onClick, children,className,width=1,noStatus}: {
    status: status,
    onClick: () => void,
    children: any,
    className?:string,
    width?:number,
    noStatus?:boolean
}) {
    let contentMode = 'text'
    if(typeof children != 'string'){
        contentMode = 'another'
    }
    return <div className={classNames(css.container,className)} onClick={onClick} style={{width:width*60+'px'}}>
        <div>
            <div className={classNames(css.light,css[status],{[css.noStatus]:noStatus})}>
            </div>
            <div className={classNames({[css.content]:contentMode==='text'},css.allContent)}>{children}</div>
        </div>
    </div>
}
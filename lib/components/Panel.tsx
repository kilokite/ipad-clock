import css from './css/Panel.module.scss'
import classNames from 'classnames'
export default function Panel({ children ,className}: { children: any ,className?:string}) {
    return <div className={classNames(css.panel,className)}>
        {children}
    </div>
}
export function Hole({ children ,className}: { children: any ,className?:string}) {
    return <div className={classNames(css.hole,className)}>
        {children}
    </div>
}
export default function LibLogo({className}:{
    className?:string
}){
     console.log('render','logo')
    // return <object type="image/svg+xml" data="/libLogo.svg" width="250px" className={className}/>
    return <img src="/libLogo.svg" alt="logo" className={className}/>
}
export function generateStaticParams() {
    return [{slug:'a'},{slug:'b'}]
}
export default async function page({params}:{params:Promise<{slug:string}>}){
    let {slug} = await params
    return <div>slug:{slug}</div>
}
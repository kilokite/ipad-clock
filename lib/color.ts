let colorMap:{
    [key:string]:string
} = {
    'red-main':'#B20000',
    'red-highlight':'#ED0000',
    'red-dark':'#A00000',
    'red-dark2':'#5D0000',
    'green-special':'B7FF00',
    'green':'#008800',
    'blue':'#0000FF',
    'yellow':'#FFFF00',
    'white':'#FFFFFF',
}
export default function colorHandle(color:string|undefined):string{
    if(!color){
        return colorMap['green']
    }
    if(color.startsWith('@')){
        return colorMap[color.substring(1)] || colorMap['green']
    }
    return color
}

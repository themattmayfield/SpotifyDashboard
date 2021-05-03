
export default function Card(props) {
    return (
        <div className="inline-block">
        <div 
        style={{
            backgroundImage: `url(${props.info.images[1].url})`}}
        className="rounded-3xl h-96 w-64 max-w-xs overflow-hidden bg-red-600 bg-cover bg-center">           
            
            </div></div>
    )
}
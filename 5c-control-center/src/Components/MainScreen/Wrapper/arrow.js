const styleSheet = {
    arrow: (direction)=>({
        width: "20px",
        height: "5px",
        backgroundColor: "green",
        marginTop: direction === "up" ? "10px": "0px", 
    }),
    top: (direction)=>{
        
        switch(direction){
            case "right": {
                return ({
                    transform: "rotate(45deg)"
                })
            }
            case "left": {
                return ({
                    transform: "rotate(135deg)"
                })
            }
            case "up": {
                return ({
                    transform: "rotate(135deg) translateX(5px)"
                })
            }
            case "down": {
                return ({
                    transform: "rotate(225deg)"
                })
            }
        }
    }, 
    bot:(direction)=>{
        switch(direction){
            case "right": {
                return ({
                    transform: "rotate(-45deg) translateX(-5px) translateY(5px)"
                })
            }
            case "left": {
                return ({
                    transform: "rotate(-135deg) translateX(-5px) translateY(-5px)"
                })
            }
            case "up": {
                return ({
                    transform: "rotate(-135deg) translateX(3px) translateY(13px)"
                })
            }
            case "down": {
                return ({
                    transform: "rotate(-225deg) translateX(-12px) translateY(-5px)"
                })
            }
        }
    }
}


const Arrow = ({direction="right",style, onClick={onClick}})=>(
    <div style={{ height:"100%",width:"100%", ...style}} onClick={onClick}>
        <div style = {{display:"flex", justifyContent: 'center', alignItems:"center", height:"100%" }}>
            <div>
                <div style = {{...styleSheet.arrow(direction),...styleSheet.top(direction)}}/>
                <div style = {{...styleSheet.arrow(direction),...styleSheet.bot(direction)}}/>
            </div>
        </div>
    </div>
)

export default Arrow; 
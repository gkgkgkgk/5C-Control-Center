import React from 'react'; 


const defaultStyle = {
    flex:"0 0 240px",
    borderRadius: "5px",
    border: "1px solid black",
    textAlign: 'center',
    fontSize: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"

    
}

const selectedStyle = {
    backgroundColor:"yellow"
    
}

const unselectedStyle = {
}

const styleGen = (f)=>{
    const style = f() ? selectedStyle: unselectedStyle; 
    return {...defaultStyle, ...style}
}

const Card = ({checked, Name, onClick})=>(
    <div style={styleGen(checked)} onClick={()=>onClick(Name)} className={Name}>
        <p>{Name}</p>
    </div>
)

export default Card; 
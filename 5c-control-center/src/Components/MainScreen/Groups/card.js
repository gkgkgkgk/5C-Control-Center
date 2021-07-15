import React from 'react'; 


const defaultStyle = {
    flex:"0 0 120px",
    height:"50px", 
    borderRadius: "5px",
    border: "1px solid black",
    textAlign: 'center',

    
}

const selectedStyle = {
    fontWeight: '700'
}

const unselectedStyle = {
    fontWeight: '300'
}

const Card = ({checked, Name, onClick})=>(
    <div style={defaultStyle} onClick={()=>onClick(Name)} className={Name}>
        <p><span style = {checked() ? selectedStyle:unselectedStyle}>{Name}</span></p>
    </div>
)

export default Card; 
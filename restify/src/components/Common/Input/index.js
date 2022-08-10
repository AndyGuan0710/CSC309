import React from 'react';

class Input extends React.Component {
    render(){
        const {type, classes, update, name, value, id, placeholder, style} = this.props
        return <>

            <input className={classes}
                   style={style}
                   type={type}
                   value={value}
                   name = {name}
                   onChange={event => update(event.target.value)}
                   id = {id}
                   placeholder={placeholder}
            />
        </>
    }
}

export default Input;

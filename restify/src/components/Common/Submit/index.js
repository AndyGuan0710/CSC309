import React from 'react';

class Submit extends React.Component {
    render(){
        const { classes, click, name, value, id} = this.props
        return <>
            <button
                   className={classes}
                   onClick={click}
                   name={name}
                   value={value}
                   id={id}>
                {value}
            </button>
        </>
    }
}

export default Submit
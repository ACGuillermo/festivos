import React from 'react';

const Loading = ({coord, municipio}) => {

    return(
        <>
            {coord || municipio ? <h1>Puede...</h1> : null}
        </>
    )
}

export default Loading
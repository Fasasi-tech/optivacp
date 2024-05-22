import React, {useState, useEffect} from 'react'

const OnWelcome = ({onClose}) => {
   
    //   }, [countdown, onClose]);
    const handleCloseButtonClick = () => {
      // Call the onClose function passed as a prop
      onClose();
    };

  return (
    <div>
        <h1>welcome to optiva's leave application</h1>
        <button onClick={handleCloseButtonClick}>continue</button>
    </div>
  )
}

export default OnWelcome
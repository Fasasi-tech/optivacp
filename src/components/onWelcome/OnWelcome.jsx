import React, {useState, useEffect} from 'react'

const OnWelcome = ({onClose}) => {
    // const [countdown, setCountdown] = useState(5);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       setCountdown((prevCount) => prevCount - 1);
    //     }, 1000);
    
    //     return () => clearInterval(interval);
    //   }, []);

    //   useEffect(() => {
    //     if (countdown === 0) {
    //       onClose();
    //     }
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
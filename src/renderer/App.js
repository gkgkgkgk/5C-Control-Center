import React, { useState } from 'react';
import SleepScreen from './Components/SleepScreen';
import MainScreen from './Components/MainScreen';
const App = () => {

  const [isSleep, setSleep] = useState(true);

  const toggleSleep = () => {
    setSleep(!isSleep);
  }


  return (
    <div style={{ height: '100%', margin: 0, fontFamily: 'Poppins' }}>
      {isSleep ? <SleepScreen toggleView={toggleSleep} /> : <MainScreen toggleView={toggleSleep} />}
    </div>
  )
}

export default App;
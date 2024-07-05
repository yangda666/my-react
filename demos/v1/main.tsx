import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
const App = () => {
  const [num, setNum] = useState(100);

  return (
    <p
      onClick={() => {
        setNum(num + 1);
      }}
    >
      {num}
    </p>
  );
};

// const comp = <div>12233</div>;
console.log('react', React);
// console.log('comp', comp);

const root = document.getElementById('root');
root && ReactDOM.createRoot(root).render(<App />);

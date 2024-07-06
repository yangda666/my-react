import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
const App = () => {
  const [num, setNum] = useState(100);

  const arr =
    num % 2 === 0
      ? [<li key="1"> 1</li>, <li key="2"> 2</li>, <li key="3"> 3</li>]
      : [<li key="3"> 3</li>, <li key="2"> 2</li>, <li key="1"> 1</li>];
  return (
    <ul
      onClick={() => {
        setNum(num + 1);
      }}
    >
      <li key="3"> 3</li>
      <li key="2"> 2</li>
      <li key="1"> 1</li>
    </ul>
  );
};

// const comp = <div>12233</div>;
console.log('react', React);
// console.log('comp', comp);

const root = document.getElementById('root');
root && ReactDOM.createRoot(root).render(<App />);

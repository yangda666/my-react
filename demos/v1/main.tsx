import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
const App = () => {
  const [num, setNum] = useState(100);

  const before = [
    <li key={1}>1</li>,
    <li>2</li>,
    <li>3</li>,
    <li key={4}>4</li>
  ];
  const after = [
    <li key={4}>4</li>,
    <li>2</li>,
    <li>3</li>,
    <li key={1}>1</li>
  ];
  const arr = num % 2 === 0 ? before : after;
  return (
    <ul
      onClick={() => {
        setNum(num + 1);
      }}
    >
      {arr}
    </ul>
  );
};

// const comp = <div>12233</div>;
console.log('react', React);
// console.log('comp', comp);

const root = document.getElementById('root');
root && ReactDOM.createRoot(root).render(<App />);

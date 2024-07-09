import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
function App() {
  const [num, setNum] = useState(100);

  // const before = [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>];
  // const after = [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];

  // const before = [
  //   <li>
  //     4 <input type="text" />
  //   </li>,
  //   <li>
  //     2 <input type="text" />
  //   </li>,
  //   <li>
  //     3 <input type="text" />
  //   </li>,
  //   <li>
  //     1 <input type="text" />
  //   </li>
  // ];
  // const after = [
  //   <li>
  //     1 <input type="text" />
  //   </li>,
  //   <li>
  //     2 <input type="text" />
  //   </li>,
  //   <li>
  //     3 <input type="text" />
  //   </li>,
  //   <li>
  //     4 <input type="text" />
  //   </li>
  // ];
  const before = [
    <li key={4}>
      4 <input type="text" />
    </li>,
    <li key={2}>
      2 <input type="text" />
    </li>,
    <li key={3}>
      3 <input type="text" />
    </li>,
    <li key={1}>
      1 <input type="text" />
    </li>
  ];
  const after = [
    <li key={1}>
      1 <input type="text" />
    </li>,
    <li key={2}>
      2 <input type="text" />
    </li>,
    <li key={3}>
      3 <input type="text" />
    </li>,
    <li key={4}>
      4 <input type="text" />
    </li>
  ];

  const arr = num % 2 === 0 ? before : after;
  return (
    <div>
      <ul>{arr}</ul>
      <button
        onClick={() => {
          setNum(num + 1);
        }}
      >
        加一
      </button>
    </div>
  );
}

// const comp = <div>12233</div>;
console.log('react', React);
// console.log('comp', comp);

const root = document.getElementById('root');
root && ReactDOM.createRoot(root).render(<App />);

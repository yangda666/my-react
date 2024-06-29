import React from 'react';
import reactDOM from 'react-dom';
const Comp = () => (
  <p>
    <Child />
  </p>
);
const Child = () => <span>我是汉字</span>;
const root = document.getElementById('root');
console.log(React);
console.log(reactDOM);
reactDOM.createRoot(root).render(<Comp />);

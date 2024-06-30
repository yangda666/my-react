import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [state, setState] = useState(100);
  return <p>123</p>;
};

const Child = () => <span>我是汉字</span>;
const root = document.getElementById('root');

console.log(ReactDOM);
ReactDOM.createRoot(root).render(<App />);

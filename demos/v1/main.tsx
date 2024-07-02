import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [state, setState] = useState(100);
  return <p>123</p>;
};
const root = document.getElementById('root');
root && ReactDOM.createRoot(root).render(<App />);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { Board } from './components/board';
import { getInitialData } from './components/dummyDara';

const App = () => (
  <div className="flex h-screen flex-col">
    <div className="relative flex-grow">
      <div className="absolute inset-0">
        <main className="h-full bg-sky-700">
          <Board initial={getInitialData()} />
        </main>
      </div>
    </div>
  </div>
);
const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);

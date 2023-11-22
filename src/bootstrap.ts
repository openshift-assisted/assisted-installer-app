import React from 'react';
import { render } from 'react-dom';
import RootApp from './components/root-app';

function bootstrap() {
  const rootElement = document.getElementById('root');
  render(React.createElement(RootApp), rootElement, () =>
    rootElement?.setAttribute('data-ouia-safe', 'true')
  );
}

bootstrap();

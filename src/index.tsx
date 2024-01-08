import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iwdgvmisbscppludogev.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZGd2bWlzYnNjcHBsdWRvZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5MTM4NDAsImV4cCI6MjAxOTQ4OTg0MH0.NK1eHQrQQ_V0-SLSyaWOfTsWbVipEkG9t7JsOQ0Gcho'
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);

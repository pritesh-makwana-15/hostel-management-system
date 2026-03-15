// import AppRouter from './router/AppRouter';
import AppRouter from './routes/AppRouter';
import './styles/variables.css';

/**
 * App.jsx
 *
 * Root component — intentionally slim.
 * All routing logic lives in AppRouter and its route modules.
 *
 * Providers (AuthProvider, BrowserRouter, etc.) should be
 * in main.jsx / index.jsx wrapping this component, e.g.:
 *
 *   <BrowserRouter>
 *     <AuthProvider>
 *       <App />
 *     </AuthProvider>
 *   </BrowserRouter>
 */
function App() {
  return <AppRouter />;
}

export default App;
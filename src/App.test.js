import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import authSlice from './store/authSlice';
import dashboardSlice from './store/dashboardSlice';

const theme = createTheme();

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
      dashboard: dashboardSlice,
    },
    preloadedState: initialState
  });
};

const renderWithProviders = (ui, { initialState = {}, ...renderOptions } = {}) => {
  const store = createTestStore(initialState);
  
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

test('renders login page when not authenticated', () => {
  const initialState = {
    auth: {
      isAuthenticated: false,
      loading: false,
      user: null,
      token: null,
      error: null
    }
  };

  renderWithProviders(<App />, { initialState });
  
  expect(screen.getByText(/Military Asset Login/i)).toBeInTheDocument();
});

test('renders dashboard when authenticated', () => {
  const initialState = {
    auth: {
      isAuthenticated: true,
      loading: false,
      user: { id: '1', username: 'test', role: 'admin' },
      token: 'fake-token',
      error: null
    },
    dashboard: {
      metrics: null,
      loading: false,
      error: null
    }
  };

  renderWithProviders(<App />, { initialState });
  
  expect(screen.getByText(/Asset Management Dashboard/i)).toBeInTheDocument();
});

import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from 'react-oidc-context';
import { User } from 'oidc-client-ts';
import { cacheExchange, createClient, fetchExchange, Provider } from 'urql';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive-min.css';
import App from './App';

interface AuthConfig {
  authority: string;
  client_id: string;
  client_secret: string;
}

function AuthProviderWithNavigate({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [authConfig, setAuthConfig] = useState<AuthConfig>();

  const onSignIn = (user: void | User) => {
    navigate(user?.state || window.location.pathname, { replace: true });
  };

  useEffect(() => {
    const loadAuthConfig = async () => {
      const response = await fetch(import.meta.env.VITE_CONFIG_ENDPOINT || '');
      setAuthConfig(await response.json());
    };

    loadAuthConfig();
  }, []);

  return (authConfig && (
    <AuthProvider
      authority={authConfig.authority}
      client_id={authConfig.client_id}
      client_secret={authConfig.client_secret}
      redirect_uri={window.location.origin}
      response_type="code"
      scope="openid email profile"
      onSigninCallback={onSignIn}
    >
      {children}
    </AuthProvider>
  )) as ReactElement;
}

function AuthorizedUrqlProvider({ children }: PropsWithChildren) {
  const auth = useAuth();

  const client = createClient({
    url: import.meta.env.VITE_GRAPHQL_ENDPOINT || '',
    fetchOptions: () => {
      if (auth.user)
        return {
          headers: { Authorization: `Bearer ${auth.user.id_token}` },
        };
      return {};
    },
    exchanges: [cacheExchange, fetchExchange],
  });

  return <Provider value={client}>{children}</Provider>;
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProviderWithNavigate>
        <AuthorizedUrqlProvider>
          <App />
        </AuthorizedUrqlProvider>
      </AuthProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);

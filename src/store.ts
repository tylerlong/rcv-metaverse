import {TokenInfo} from '@rc-ex/core/lib/definitions';
import {useProxy} from '@tylerlong/use-proxy';
import localforage from 'localforage';
import AuthorizeUriExtension from '@rc-ex/authorize-uri';

import {Store} from './models';
import rc from './ringcentral';

const redirectUri = window.location.origin + window.location.pathname;

const urlSearchParams = new URLSearchParams(
  new URL(window.location.href).search
);
const code = urlSearchParams.get('code');

const store = useProxy(new Store());

const checkSavedToken = async () => {
  const tokenInfo = await localforage.getItem<TokenInfo>(
    'rcv-metaverse-token-info'
  );
  if (tokenInfo === null) {
    return false;
  }
  rc.token = tokenInfo;
  try {
    await rc.refresh();
    await localforage.setItem('rcv-metaverse-token-info', rc.token);
  } catch (e) {
    return false;
  }
  return true;
};

(async () => {
  if (code === null) {
    const hasToken = await checkSavedToken();
    store.hasToken = hasToken;
    if (!hasToken) {
      const authorizeUriExtension = new AuthorizeUriExtension();
      await rc.installExtension(authorizeUriExtension);
      store.loginUrl = authorizeUriExtension.buildUri({
        redirect_uri: redirectUri,
        code_challenge_method: 'S256',
      });
      const codeVerifier = authorizeUriExtension.codeVerifier;
      await localforage.setItem('rcv-metaverse-code-verifier', codeVerifier);
    }
    store.ready = true;
  } else {
    await rc.authorize({
      code,
      redirect_uri: redirectUri,
      code_verifier:
        (await localforage.getItem<string>('rcv-metaverse-code-verifier')) ??
        'fake-code-verifier',
    });
    await localforage.setItem('rcv-metaverse-token-info', rc.token);
    window.location.replace(redirectUri);
  }
})();

export default store;

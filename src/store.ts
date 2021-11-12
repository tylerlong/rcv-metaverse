import {TokenInfo} from '@rc-ex/core/lib/definitions';
import {useProxy} from '@tylerlong/use-proxy';
import localforage from 'localforage';

import {Store} from './models';
import rc from './ringcentral';

const store = useProxy(new Store());

const checkSavedToken = async () => {
  const tokenInfo = await localforage.getItem<TokenInfo>(
    'rcv-metaverse-token-info'
  );
  if (tokenInfo === null) {
    store.hasToken = false;
    return;
  }
  rc.token = tokenInfo;
  try {
    await rc.refresh();
  } catch (e) {
    store.hasToken = false;
    return;
  }
  store.hasToken = true;
};

(async () => {
  await checkSavedToken();
  store.ready = true;
})();

export default store;

import HomeTemp from '../templates/Home';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

import { Web3Modal } from '@web3modal/react';

import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';

const chains = [chain.polygon];
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: 'ebdc52dd6b1bd4191f49d74c59f9f205' }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <HomeTemp />
      </WagmiConfig>

      <Web3Modal
        projectId="ebdc52dd6b1bd4191f49d74c59f9f205"
        theme="dark"
        accentColor="default"
        ethereumClient={ethereumClient}
      />
    </>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
import '/public/fonts/inter/inter.css';
import '/src/styles/variables.css';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AddressBlocked } from 'src/components/AddressBlocked';
import { Meta } from 'src/components/Meta';
import { TransactionEventHandler } from 'src/components/TransactionEventHandler';
import { GasStationProvider } from 'src/components/transactions/GasStation/GasStationProvider';
import { AppDataProvider } from 'src/hooks/app-data-provider/useAppDataProvider';
import { ModalContextProvider } from 'src/hooks/useModal';
import { Web3ContextProvider } from 'src/libs/web3-data-provider/Web3Provider';
import CustomReferralDialog from 'src/modules/profile/custom-referral-dialog';
import { GlobalLoading } from 'src/modules/profile/GlobalLoading';
import SignatureRequestModal from 'src/modules/profile/signature-request-modal';
import { useGlobalLoadingStore } from 'src/store/loadingSlice';
import { useRootStore } from 'src/store/root';
import { SharedDependenciesProvider } from 'src/ui-config/SharedDependenciesProvider';

import createEmotionCache from '../src/createEmotionCache';
import { AppGlobalStyles } from '../src/layouts/AppGlobalStyles';
import { LanguageProvider } from '../src/libs/LanguageProvider';

const SwitchModal = dynamic(() =>
  import('src/components/transactions/Switch/SwitchModal').then((module) => module.SwitchModal)
);

const BridgeModal = dynamic(() =>
  import('src/components/transactions/Bridge/BridgeModal').then((module) => module.BridgeModal)
);

const BorrowModal = dynamic(() =>
  import('src/components/transactions/Borrow/BorrowModal').then((module) => module.BorrowModal)
);
const ClaimRewardsModal = dynamic(() =>
  import('src/components/transactions/ClaimRewards/ClaimRewardsModal').then(
    (module) => module.ClaimRewardsModal
  )
);
const CollateralChangeModal = dynamic(() =>
  import('src/components/transactions/CollateralChange/CollateralChangeModal').then(
    (module) => module.CollateralChangeModal
  )
);
const DebtSwitchModal = dynamic(() =>
  import('src/components/transactions/DebtSwitch/DebtSwitchModal').then(
    (module) => module.DebtSwitchModal
  )
);
const EmodeModal = dynamic(() =>
  import('src/components/transactions/Emode/EmodeModal').then((module) => module.EmodeModal)
);
const FaucetModal = dynamic(() =>
  import('src/components/transactions/Faucet/FaucetModal').then((module) => module.FaucetModal)
);
const RateSwitchModal = dynamic(() =>
  import('src/components/transactions/RateSwitch/RateSwitchModal').then(
    (module) => module.RateSwitchModal
  )
);
const RepayModal = dynamic(() =>
  import('src/components/transactions/Repay/RepayModal').then((module) => module.RepayModal)
);
const SupplyModal = dynamic(() =>
  import('src/components/transactions/Supply/SupplyModal').then((module) => module.SupplyModal)
);
const SwapModal = dynamic(() =>
  import('src/components/transactions/Swap/SwapModal').then((module) => module.SwapModal)
);
const WithdrawModal = dynamic(() =>
  import('src/components/transactions/Withdraw/WithdrawModal').then(
    (module) => module.WithdrawModal
  )
);
const StakingMigrateModal = dynamic(() =>
  import('src/components/transactions/StakingMigrate/StakingMigrateModal').then(
    (module) => module.StakingMigrateModal
  )
);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWeb3Library(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}
export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  const initializeMixpanel = useRootStore((store) => store.initializeMixpanel);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (window.gtag) {
        window.gtag('config', 'G-MCCB3CJSSB', {
          page_path: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL;
  useEffect(() => {
    if (MIXPANEL_TOKEN) {
      initializeMixpanel();
    } else {
      console.log('no analytics tracking');
    }
  }, []);
  const isGlobalLoading = useGlobalLoadingStore((state) => state.isGlobalLoading);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Meta
        title={'Open Source Liquidity Protocol on assetchain'}
        description={
          'Eden Finance is an Open Source Protocol to create Non-Custodial Liquidity Markets to earn interest on supplying and borrowing assets with a variable or stable interest rate. The protocol is designed for easy integration into your products and services.'
        }
        imageUrl="https://app.edenfinance.org/favicon.ico"
      />
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <Web3ReactProvider getLibrary={getWeb3Library}>
            <Web3ContextProvider>
              <AppGlobalStyles>
                <AddressBlocked>
                  <ModalContextProvider>
                    <SharedDependenciesProvider>
                      <AppDataProvider>
                        <GasStationProvider>
                          {isGlobalLoading && <GlobalLoading />}
                          {getLayout(<Component {...pageProps} />)}
                          <SupplyModal />
                          <Toaster />
                          <SignatureRequestModal />
                          <CustomReferralDialog />
                          <WithdrawModal />
                          <BorrowModal />
                          <RepayModal />
                          <CollateralChangeModal />
                          <RateSwitchModal />
                          <DebtSwitchModal />
                          <ClaimRewardsModal />
                          <EmodeModal />
                          <SwapModal />
                          <FaucetModal />
                          <TransactionEventHandler />
                          <SwitchModal />
                          <StakingMigrateModal />
                          <BridgeModal />
                        </GasStationProvider>
                      </AppDataProvider>
                    </SharedDependenciesProvider>
                  </ModalContextProvider>
                </AddressBlocked>
              </AppGlobalStyles>
            </Web3ContextProvider>
          </Web3ReactProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </LanguageProvider>

      <Script
        id="tawkto"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
         
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/68409fd6468ee7190935d89a/1itd5oksg';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
          `,
        }}
      />

      <Script
        id="gtag"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-MCCB3CJSSB"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MCCB3CJSSB');
          `,
        }}
      />
    </CacheProvider>
  );
}

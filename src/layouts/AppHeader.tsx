import { HomeIcon } from '@heroicons/react/outline';
// import { Trans } from '@lingui/macro';
import {
  Button,
  SvgIcon,
  // Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useEffect, useState } from 'react';
// import { ContentWithTooltip } from 'src/components/ContentWithTooltip';
import { useRootStore } from 'src/store/root';
import { ENABLE_TESTNET } from 'src/utils/marketsAndNetworksConfig';

import { Link } from '../components/primitives/Link';
// import { uiConfig } from '../uiConfig';
import { NavItems } from './components/NavItems';
import { MobileMenu } from './MobileMenu';
// import { SettingsMenu } from './SettingsMenu';
import WalletWidget from './WalletWidget';

export function AppHeader() {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const sm = useMediaQuery(breakpoints.down('sm'));

  const [mobileDrawerOpen, setMobileDrawerOpen] = useRootStore((state) => [
    state.mobileDrawerOpen,
    state.setMobileDrawerOpen,
  ]);

  const [walletWidgetOpen, setWalletWidgetOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('testnetsEnabled', 'true');
    if (mobileDrawerOpen && !md) {
      setMobileDrawerOpen(false);
    }
    if (walletWidgetOpen) {
      setWalletWidgetOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [md]);

  const headerHeight = 48;

  const toggleWalletWigit = (state: boolean) => {
    if (md) setMobileDrawerOpen(state);
    setWalletWidgetOpen(state);
  };

  const toggleMobileMenu = (state: boolean) => {
    if (md) setMobileDrawerOpen(state);
    setMobileMenuOpen(state);
  };

  // const disableTestnet = () => {
  //   localStorage.setItem('testnetsEnabled', 'false');
  //   // Set window.location to trigger a page reload when navigating to the the dashboard
  //   window.location.href = '/';
  // };

  // const testnetTooltip = (
  //   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
  //     <Typography variant="subheader1">
  //       <Trans>Testnet mode is ON</Trans>
  //     </Typography>
  //     <Typography variant="description">
  //       <Trans>The app is running in testnet mode. Learn how it works in</Trans>{' '}
  //       <Link
  //         href="https://docs.aave.com/faq/testing-aave"
  //         style={{ fontSize: '14px', fontWeight: 400, textDecoration: 'underline' }}
  //       >
  //         FAQ.
  //       </Link>
  //     </Typography>
  //     <Button variant="outlined" sx={{ mt: '12px' }} onClick={disableTestnet}>
  //       <Trans>Disable testnet</Trans>
  //     </Button>
  //   </Box>
  // );

  return (
    // <HideOnScroll>
    <Box
      component="header"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sx={(theme) => ({
        height: '100vh', // Full height of the viewport
        position: 'fixed', // Fixed positioning
        top: 0,
        left: 0,
        display: 'flex',
        width: { sm: 240 }, // Sidebar width
        border: '1px dashed grey',
        transition: theme.transitions.create('top'),
        zIndex: theme.zIndex.appBar,
        bgcolor: theme.palette.background.header,
        borderColor: 'divider',

        padding: {
          xs: mobileMenuOpen || walletWidgetOpen ? '8px 20px' : '8px 8px 8px 20px',
          xsm: '8px 20px',
          md: '40px ',
        },
        // alignItems: 'center',
        flexDirection: 'column',
        boxShadow: 'inset 0px -1px 0px rgba(242, 243, 247, 0.16)',
      })}
    >
      <Box
        component={Link}
        href="/"
        aria-label="Go to homepage"
        sx={{
          lineHeight: 0,
          mr: 3,
          transition: '0.3s ease all',
          '&:hover': { opacity: 0.7 },
        }}
        onClick={() => setMobileMenuOpen(false)}
      >
        {/* <img src={uiConfig.appLogo} alt="AAVE" width={72} height={20} /> */}
      </Box>
      <Box sx={{ mr: sm ? 1 : 3 }}>
        {ENABLE_TESTNET && (
          // <ContentWithTooltip tooltipContent={testnetTooltip} offset={[0, -4]} withoutHover>
          <Button
            variant="surface"
            size="small"
            color="primary"
            sx={{
              backgroundColor: '#00C289',
              '&:hover, &.Mui-focusVisible': { backgroundColor: '#0D131A' },
            }}
          >
            EDEN FINANCE
            <SvgIcon sx={{ marginLeft: '2px', fontSize: '16px' }}>
              <HomeIcon />
            </SvgIcon>
          </Button>
          // </ContentWithTooltip>
        )}
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'flex' }, mt: 10 }}>
        <NavItems />
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {!mobileMenuOpen && (
        <WalletWidget
          open={walletWidgetOpen}
          setOpen={toggleWalletWigit}
          headerHeight={headerHeight}
        />
      )}

      {/* <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <SettingsMenu />
        </Box> */}

      {!walletWidgetOpen && (
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <MobileMenu
            open={mobileMenuOpen}
            setOpen={toggleMobileMenu}
            headerHeight={headerHeight}
          />
        </Box>
      )}
    </Box>
    // </HideOnScroll>
  );
}

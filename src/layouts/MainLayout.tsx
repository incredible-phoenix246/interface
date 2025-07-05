import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';

export function MainLayout({ children }: { children: ReactNode }) {
  // const APP_BANNER_VERSION = '1.0.0';
  return (
    <>
      <Box sx={{ height: '100vh', maxWidth: '100vw' }}>
        <AppHeader />
        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            marginTop: '1rem',
            padding: 3,
            ml: {
              md: '15%',
            },
          }}
        >
          {children}
          <AppFooter />
        </Box>
      </Box>
    </>
  );
}

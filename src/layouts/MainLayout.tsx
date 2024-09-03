import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import { FeedbackModal } from 'src/layouts/FeedbackDialog';

// import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader'; // Sidebar now
// import TopBarNotify from './TopBarNotify';

export function MainLayout({ children }: { children: ReactNode }) {
  // const APP_BANNER_VERSION = '1.0.0';

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box
          component="nav"
          sx={{
            width: { sm: 240 }, // Adjust the sidebar width as needed
            flexShrink: { sm: 0 },
            backgroundColor: 'background.default',
            borderRight: '1px solid',
            borderColor: 'divider',
            height: '100vh',
          }}
        >
          <AppHeader />
          {/* <AppFooter /> */}
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 3, // Adjust padding as needed
            backgroundColor: 'background.default',
          }}
        >
          {children}

          <FeedbackModal />
        </Box>
      </Box>
    </>
  );
}

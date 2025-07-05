import { Box } from '@mui/material';
import { MainLayout } from 'src/layouts/MainLayout';
import ProfilePage from 'src/modules/profile/profile-page';

import { ConnectWalletPaper } from '../src/components/ConnectWalletPaper';
import { ContentContainer } from '../src/components/ContentContainer';
import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';

export default function ProfilePageInterface() {
  const { currentAccount, loading: web3Loading } = useWeb3Context();

  return (
    <ContentContainer>
      {currentAccount ? (
        <ProfilePage />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: { xs: 3, xsm: 4, lg: 5 },
            height: '100vh',
          }}
        >
          <ConnectWalletPaper loading={web3Loading} />
        </Box>
      )}
    </ContentContainer>
  );
}

ProfilePageInterface.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

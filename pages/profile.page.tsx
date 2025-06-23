import { MainLayout } from 'src/layouts/MainLayout';
import ProfilePage from 'src/modules/profile/profile-page';

export default function ProfilePageInterface() {
  return <ProfilePage />;
}

ProfilePageInterface.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

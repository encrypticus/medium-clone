import ErrorPage from '@/app/(site)/settings/error';
import { getUserInfo } from '@/src/shared/api';
import { UpdateProfileForm } from '@/src/features/update-profile';

export const ProfileSettingsPage = async () => {
  try {
    const userInfo = await getUserInfo();
    return <UpdateProfileForm user={userInfo} />;
  } catch (error) {
    if (error instanceof Error) {
      return <ErrorPage error={error.message} />;
    }
  }
};

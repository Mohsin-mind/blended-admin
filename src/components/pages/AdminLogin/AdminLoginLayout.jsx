import PropTypes from 'prop-types';
import LoginFormSection from './LoginFormSection.jsx';
import ImageSection from './ImageSection';
import adminLoginFrame from '@/assets/images/svg/admin_login_frame.png';

function AdminLoginLayout({
  imageSrc = adminLoginFrame,
  altText = 'Admin Login',
  formComponent: FormComponent = LoginFormSection,
}) {
  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      {/* Left Column - Login Form */}
      <div className='flex-1 w-full flex flex-col h-screen lg:h-screen relative'>
        <FormComponent />
      </div>

      {/* Right Column - Image */}
      <div className='flex-1 bg-blended-gray_4 h-64 lg:h-screen lg:w-auto'>
        <ImageSection
          imageSrc={imageSrc}
          altText={altText}
          title='Welcome Back to BlendED'
          subtitle='Access your dashboard to create courses, manage faculty, and track learner progress—all in one place.'
        />
      </div>
    </div>
  );
}

AdminLoginLayout.propTypes = {
  children: PropTypes.node,
  imageSrc: PropTypes.string,
  altText: PropTypes.string,
  formComponent: PropTypes.elementType,
};

export default AdminLoginLayout;

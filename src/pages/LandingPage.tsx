import { Box } from '@mui/material';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import WhyISTS from '@/components/landing/WhyISTS';
import JourneySection from '@/components/landing/JourneySection';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import RoleShowcase from '@/components/landing/RoleShowcase';
import FinalCTA from '@/components/landing/FinalCTA';

function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <LandingHeader />
      <main>
        <HeroSection />
        <WhyISTS />
        <JourneySection />
        <FeaturesGrid />
        <RoleShowcase />
        <FinalCTA />
      </main>

      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box component="span" sx={{ color: 'text.secondary', fontSize: '13px' }}>
          © {new Date().getFullYear()} ISTS. Built for better support.
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;

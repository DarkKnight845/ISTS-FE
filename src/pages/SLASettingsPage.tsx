import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PageHeader from '@/components/layout/PageHeader';
import SLARuleEditor from '@/components/manager/SLARuleEditor';
import { useAuth } from '@/context/AuthContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getDepartmentsRequest, type DepartmentDto } from '@/lib/api';

function SLASettingsPage() {
  const { role } = useAuth();
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDto | null>(null);

  const isAdmin = role === 'admin';

  useEffect(() => {
    let cancelled = false;

    // Managers only have access to their own department; admins can choose.
    if (!isAdmin) {
      if (user?.departmentId && user?.departmentName) {
        setSelectedDepartment({ id: user.departmentId, name: user.departmentName, description: '' });
      }
      return;
    }

    setDepartmentsLoading(true);
    setDepartmentsError(null);

    getDepartmentsRequest()
      .then((data) => {
        if (!cancelled) setDepartments(data ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          setDepartmentsError(err instanceof Error ? err.message : 'Failed to load departments');
        }
      })
      .finally(() => {
        if (!cancelled) setDepartmentsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAdmin, user]);

  useEffect(() => {
    if (!isAdmin || !user?.departmentId || departments.length === 0 || selectedDepartment) return;
    const match = departments.find((d) => d.id === user.departmentId);
    if (match) {
      setSelectedDepartment(match);
    }
  }, [isAdmin, user, departments, selectedDepartment]);

  const isLoading = userLoading || departmentsLoading;

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        backgroundColor: 'background.default',
      }}
    >
      <PageHeader />

      <Box sx={{ px: 5, pb: 5, flexGrow: 1, overflowY: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            SLA Rules
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '14px' }}>
            Configure response and resolution targets for each priority in a department.
          </Typography>
        </Box>

        {(userError || departmentsError) && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {userError || departmentsError}
          </Alert>
        )}

        {selectedDepartment && (
          <Paper
            sx={{
              p: '20px',
              mb: 4,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              maxWidth: 520,
            }}
          >
            <BusinessIcon sx={{ color: 'text.secondary', width: 22, height: 22 }} />
            <Typography sx={{ color: 'text.secondary', fontSize: '14px', fontWeight: 500 }}>Department:</Typography>

            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CircularProgress size={18} sx={{ color: 'primary.main' }} />
                <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>Loading…</Typography>
              </Box>
            ) : (
              <Typography sx={{ color: 'text.primary', fontSize: '14px', fontWeight: 600 }}>
                {selectedDepartment.name}
              </Typography>
            )}
          </Paper>
        )}

        {selectedDepartment ? (
          <SLARuleEditor departmentId={selectedDepartment.id} />
        ) : !isLoading ? (
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            {isAdmin
              ? 'Please select a department to view or configure its SLA rules.'
              : 'Your department profile is missing. Contact an administrator.'}
          </Alert>
        ) : null}
      </Box>
    </Box>
  );
}

export default SLASettingsPage;

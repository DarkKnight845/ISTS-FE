import { useEffect, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import PageHeader from '@/components/layout/PageHeader';
import SLARuleEditor from '@/components/manager/SLARuleEditor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getDepartmentsRequest, type DepartmentDto } from '@/lib/api';

function SLASettingsPage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDto | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDepartmentsLoading(true);
    setDepartmentsError(null);

    getDepartmentsRequest()
      .then((data) => {
        if (!cancelled) {
          setDepartments(data ?? []);
        }
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
  }, []);

  // Default to the manager's own department once user and departments are loaded.
  useEffect(() => {
    if (user?.departmentId && departments.length > 0 && !selectedDepartment) {
      const match = departments.find((d) => d.id === user.departmentId);
      if (match) {
        setSelectedDepartment(match);
      }
    }
  }, [user, departments, selectedDepartment]);

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
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
            Configure response and resolution targets for each priority in a department.
          </Typography>
        </Box>

        {(userError || departmentsError) && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
            {userError || departmentsError}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 4, maxWidth: 420 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
              <CircularProgress size={20} sx={{ color: 'primary.main' }} />
              <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>Loading departments…</Typography>
            </Box>
          ) : (
            <Autocomplete
              options={departments}
              getOptionLabel={(option) => option.name}
              value={selectedDepartment}
              onChange={(_, value) => setSelectedDepartment(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Department"
                  placeholder="Select a department"
                  size="small"
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              fullWidth
              disableClearable={departments.length > 0}
            />
          )}
        </FormControl>

        {selectedDepartment ? (
          <SLARuleEditor departmentId={selectedDepartment.id} />
        ) : !isLoading ? (
          <Alert severity="info" sx={{ borderRadius: '10px' }}>
            Please select a department to view or configure its SLA rules.
          </Alert>
        ) : null}
      </Box>
    </Box>
  );
}

export default SLASettingsPage;

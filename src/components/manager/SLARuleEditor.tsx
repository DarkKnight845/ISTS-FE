import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import {
  createSLARequest,
  getSLAByDepartmentRequest,
  updateSLARequest,
  type SLAPriorityInput,
  type TicketPriority,
} from '@/lib/api';

interface SLARuleEditorProps {
  departmentId: string;
}

const PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

const DEFAULT_RULES: SLAPriorityInput[] = PRIORITIES.map((priority) => ({
  priority,
  responseTimeMinutes: 15,
  resolutionTimeMinutes: 60,
}));

function SLARuleEditor({ departmentId }: SLARuleEditorProps) {
  const theme = useTheme();
  const [rules, setRules] = useState<SLAPriorityInput[]>(DEFAULT_RULES);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSaveError(null);
    setSuccess(null);
    setExists(false);

    getSLAByDepartmentRequest(departmentId)
      .then((response) => {
        if (cancelled) return;
        const existing = response.slas ?? [];
        if (existing.length > 0) {
          const mapped = PRIORITIES.map((priority) => {
            const found = existing.find((r) => r.priority === priority);
            return {
              priority,
              responseTimeMinutes: found?.responseTimeMinutes ?? 15,
              resolutionTimeMinutes: found?.resolutionTimeMinutes ?? 60,
            };
          });
          setRules(mapped);
          setExists(true);
        } else {
          setRules(DEFAULT_RULES);
          setExists(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRules(DEFAULT_RULES);
          setError(err instanceof Error ? err.message : 'Failed to load SLA rules');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  const handleChange = (priority: TicketPriority, field: keyof SLAPriorityInput, value: string) => {
    const minutes = value === '' ? 0 : Math.max(0, parseInt(value, 10));
    setRules((prev) =>
      prev.map((rule) => (rule.priority === priority ? { ...rule, [field]: minutes } : rule))
    );
    setSaveError(null);
    setSuccess(null);
  };

  const validationError = useMemo(() => {
    for (const rule of rules) {
      if (!rule.responseTimeMinutes || rule.responseTimeMinutes <= 0) {
        return `${rule.priority} response time must be greater than 0 minutes.`;
      }
      if (!rule.resolutionTimeMinutes || rule.resolutionTimeMinutes <= 0) {
        return `${rule.priority} resolution time must be greater than 0 minutes.`;
      }
      if (rule.resolutionTimeMinutes < rule.responseTimeMinutes) {
        return `${rule.priority} resolution time must be at least as large as the response time.`;
      }
    }
    return null;
  }, [rules]);

  const handleSave = async () => {
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSuccess(null);

    try {
      const payload = { departmentId, priorities: rules };
      if (exists) {
        await updateSLARequest(payload);
      } else {
        await createSLARequest(payload);
      }
      setExists(true);
      setSuccess('SLA rules saved successfully.');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save SLA rules');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {saveError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {saveError}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
          {success}
        </Alert>
      )}

      <Paper
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          overflow: 'hidden',
          mb: 3,
        }}
      >
        <TableContainer>
          <Table stickyHeader sx={{ minWidth: 520 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                {['Priority', 'Response time (minutes)', 'Resolution time (minutes)'].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: 600,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'text.secondary',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      py: '14px',
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.priority}>
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'text.primary',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      width: 160,
                    }}
                  >
                    {rule.priority}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <TextField
                      type="number"
                      size="small"
                      value={rule.responseTimeMinutes || ''}
                      onChange={(e) => handleChange(rule.priority, 'responseTimeMinutes', e.target.value)}
                      slotProps={{ htmlInput: { min: 1 } }}
                      sx={{ maxWidth: 200 }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <TextField
                      type="number"
                      size="small"
                      value={rule.resolutionTimeMinutes || ''}
                      onChange={(e) => handleChange(rule.priority, 'resolutionTimeMinutes', e.target.value)}
                      slotProps={{ htmlInput: { min: 1 } }}
                      sx={{ maxWidth: 200 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
          {exists
            ? 'Updating these rules will overwrite the existing SLA configuration for this department.'
            : 'No SLA rules exist for this department yet. Save to create them.'}
        </Typography>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={18} sx={{ color: 'primary.contrastText' }} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving || loading}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 3,
            py: 1,
            boxShadow: 'none',
          }}
        >
          {saving ? 'Saving…' : exists ? 'Update SLA rules' : 'Create SLA rules'}
        </Button>
      </Box>
    </Box>
  );
}

export default SLARuleEditor;

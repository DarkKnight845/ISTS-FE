import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
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
  invalidateCache,
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
  const [info, setInfo] = useState<string | null>(null);
  const [exists, setExists] = useState(false);

  // System.Text.Json default naming policy is camelCase, so a C# property named
  // `SLAs` serializes as `slAs`. Read every plausible key so we don't miss it.
  const extractRules = (response: SLARulesResponse): SLARuleDto[] => {
    const candidates = [
      response.slas,
      response.SLAs,
      (response as Record<string, SLARuleDto[] | undefined>).slAs,
      (response as Record<string, SLARuleDto[] | undefined>)['sLAs'],
    ];
    return candidates.find((c) => Array.isArray(c) && c.length > 0) ?? [];
  };

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    setSaveError(null);
    setSuccess(null);
    setInfo(null);

    // Bypass any stale in-memory cache for this department's SLA rules.
    invalidateCache(`/api/sla/${departmentId}`);

    try {
      const response = await getSLAByDepartmentRequest(departmentId);
      console.log('[SLA] GET response:', response);
      const existing = extractRules(response);
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
    } catch (err) {
      console.error('[SLA] GET failed:', err);
      setRules(DEFAULT_RULES);
      setExists(false);
      setError(err instanceof Error ? err.message : 'Failed to load SLA rules');
    } finally {
      setLoading(false);
    }
  };

  // Data fetch on mount / department change. loadRules updates internal state
  // after the async call, which the set-state-in-effect rule flags; disabling
  // because this is the standard fetch-then-setState pattern used across the app.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId]);

  const handleChange = (priority: TicketPriority, field: keyof SLAPriorityInput, value: string) => {
    const minutes = value === '' ? 0 : Math.max(0, parseInt(value, 10));
    setRules((prev) =>
      prev.map((rule) => (rule.priority === priority ? { ...rule, [field]: minutes } : rule))
    );
    setSaveError(null);
    setSuccess(null);
    setInfo(null);
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
    setInfo(null);

    const payload = { departmentId, priorities: rules };

    try {
      // Re-check the backend right before saving. The `exists` flag is set from
      // the initial load, but another user/session may have created rules since
      // then, or the flag may be stale. A fresh GET lets us pick the correct
      // method and avoids the 409 Conflict from POSTing over existing rules.
      const fresh = await getSLAByDepartmentRequest(departmentId);
      console.log('[SLA] pre-save GET:', fresh);
      const hasExistingRules = extractRules(fresh).length > 0;
      setExists(hasExistingRules);

      if (hasExistingRules) {
        await updateSLARequest(payload);
        setSuccess('SLA rules updated successfully.');
      } else {
        await createSLARequest(payload);
        setSuccess('SLA rules created successfully.');
      }

      // Always reload the saved rules from the backend so the UI reflects what
      // is actually stored (and not stale cache or local state).
      await loadRules();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save SLA rules';
      const status = (err as Error & { status?: number }).status;

      // Safety net: if the backend still reports a conflict, rules exist but
      // our GET detection failed. Retry with PATCH so the user's changes apply.
      if (status === 409 || message.toLowerCase().includes('already exists')) {
        setInfo('Rules already exist on the server. Retrying as update…');
        try {
          await updateSLARequest(payload);
          setExists(true);
          setInfo(null);
          setSuccess('SLA rules updated successfully.');
          await loadRules();
        } catch (retryErr) {
          const retryMessage = retryErr instanceof Error ? retryErr.message : 'Retry failed';
          const retryStatus = (retryErr as Error & { status?: number }).status;
          setSaveError(`${retryMessage}${retryStatus ? ` (HTTP ${retryStatus})` : ''}`);
        }
      } else {
        setSaveError(`${message}${status ? ` (HTTP ${status})` : ''}`);
      }
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

      {info && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
          {info}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label={exists ? 'Existing rules' : 'New rules'}
            color={exists ? 'success' : 'default'}
            sx={{ fontWeight: 600, borderRadius: '8px' }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
            {exists
              ? 'Changes will overwrite the existing SLA configuration for this department.'
              : 'No SLA rules exist yet. Save to create them.'}
          </Typography>
        </Box>
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

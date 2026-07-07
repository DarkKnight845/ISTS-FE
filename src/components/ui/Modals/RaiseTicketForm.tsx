import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";

import { useEffect, useMemo, useRef, useState } from "react";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import {
  getCategoriesRequest,
  getDepartmentsRequest,
  type CategoryDto,
  type DepartmentDto,
} from "@/lib/api";

export interface TicketFormData {
  subject: string;
  description: string;
  priority: string;
  departmentId: string;
  categoryId: string;
  attachment: File | null;
}

type RaiseTicketFormProps = {
  onSubmit: (data: TicketFormData) => void;
};

const PRIORITY_OPTIONS = [
  { label: "Low", value: "Low", color: "#16A34A" },
  { label: "Medium", value: "Medium", color: "#EAB308" },
  { label: "High", value: "High", color: "#F59E0B" },
  { label: "Urgent", value: "Urgent", color: "#DC2626" },
];

function RaiseTicketForm({ onSubmit }: RaiseTicketFormProps) {
  const theme = useTheme();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      setLoading(true);
      setFetchError(null);
      try {
        const [depts, cats] = await Promise.all([
          getDepartmentsRequest(),
          getCategoriesRequest(),
        ]);
        if (!cancelled) {
          setDepartments(depts ?? []);
          setCategories(cats ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setFetchError(
            err instanceof Error
              ? err.message
              : "Failed to load departments and categories."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    if (!departmentId) return [];
    const dept = departments.find((d) => d.id === departmentId);
    if (dept?.categories?.length) {
      return dept.categories;
    }
    return categories.filter((c) => c.departmentId === departmentId);
  }, [departmentId, departments, categories]);

  useEffect(() => {
    if (
      categoryId &&
      !filteredCategories.some((c) => c.id === categoryId)
    ) {
      setCategoryId("");
    }
  }, [filteredCategories, categoryId]);

  const inputStyle = {
    bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
    fontFamily: "General sans",

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.divider,
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.text.secondary,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },

    borderRadius: 2,

    height: 56,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!subject.trim()) {
      setSubmitError("Please enter a ticket subject.");
      return;
    }
    if (!departmentId) {
      setSubmitError("Please select a department.");
      return;
    }
    if (!categoryId) {
      setSubmitError("Please select a category.");
      return;
    }
    if (!description.trim()) {
      setSubmitError("Please describe your issue.");
      return;
    }
    if (!priority) {
      setSubmitError("Please select a priority.");
      return;
    }

    try {
      await onSubmit({
        subject: subject.trim(),
        description: description.trim(),
        priority,
        departmentId,
        categoryId,
        attachment,
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit ticket."
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={32} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      id="raise-ticket-form"
      onSubmit={handleSubmit}
    >
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          bgcolor: 'background.paper',
          p: 3,
          mb: 4,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              mb: 1,
              fontWeight: 500,
              fontFamily: "General sans",
            }}
          >
            Ticket Subject
          </Typography>

          <TextField
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Summarize your issue in one sentence"
            sx={{
              "& .MuiOutlinedInput-root": inputStyle,

              "& input::placeholder": {
                color: theme.palette.text.disabled,
                opacity: 1,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                mb: 1,
                fontWeight: 500,
                fontFamily: "General sans",
              }}
            >
              Department
            </Typography>

            <FormControl fullWidth>
              <Select
                displayEmpty
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                sx={inputStyle}
              >
                <MenuItem value="" disabled>
                  Select Department
                </MenuItem>

                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                mb: 1,
                fontWeight: 500,
                fontFamily: "General sans",
              }}
            >
              Category
            </Typography>

            <FormControl fullWidth>
              <Select
                displayEmpty
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={!departmentId || filteredCategories.length === 0}
                sx={inputStyle}
              >
                <MenuItem value="" disabled>
                  {departmentId
                    ? "Select Category"
                    : "Choose a department first"}
                </MenuItem>

                {filteredCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box>
          <Typography
            sx={{
              mb: 1,
              fontWeight: 500,
              fontFamily: "General sans",
            }}
          >
            Describe your issue
          </Typography>

          <TextField
            multiline
            rows={6}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? When did it start? What have you already tried?"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],

                borderRadius: 2,

                "& fieldset": {
                  borderColor: theme.palette.divider,
                },

                "&:hover fieldset": {
                  borderColor: theme.palette.text.secondary,
                },

                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },

              "& textarea::placeholder": {
                color: theme.palette.text.disabled,
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            mb: 2,
            fontWeight: 500,
            fontFamily: "General sans",
          }}
        >
          How urgent is this issue?
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 2,
            fontFamily: "General sans",
          }}
        >
          {PRIORITY_OPTIONS.map((item) => {
            const selected = priority === item.value;
            return (
              <Box
                key={item.value}
                onClick={() => setPriority(item.value)}
                sx={{
                  border: "1px solid",
                  borderColor: selected ? "primary.main" : theme.palette.divider,
                  backgroundColor: selected ? theme.palette.action.selected : theme.palette.background.paper,
                  borderRadius: 2,
                  p: 3,
                  cursor: "pointer",
                  transition: ".2s",

                  "&:hover": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    gap: 1,

                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,

                      height: 10,

                      borderRadius: "50%",

                      bgcolor: item.color,
                    }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontFamily: "General sans",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box>
        <Typography
          sx={{
            mb: 2,
            fontWeight: 500,
            fontFamily: "General sans",
          }}
        >
          Attach Supporting Files
        </Typography>

        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: `2px dashed ${theme.palette.divider}`,

            borderRadius: 3,

            py: 6,

            textAlign: "center",

            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],

            cursor: "pointer",

            transition: ".2s",

            "&:hover": {
              borderColor: "primary.main",

              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setAttachment(file);
            }}
          />

          <CloudUploadOutlinedIcon
            sx={{
              fontSize: 42,

              color: "text.secondary",
            }}
          />

          <Typography
            sx={{
              mt: 2,

              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {attachment ? attachment.name : "Upload files"}
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color: "text.secondary",

              fontSize: 14,
            }}
          >
            {attachment ? "Click to change file" : "Drag & drop or click to browse"}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,

              color: "text.disabled",

              fontSize: 13,
            }}
          >
            JPG, PNG, PDF • Max 10MB
          </Typography>
        </Box>
      </Box>

      {(fetchError || submitError) && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {submitError || fetchError}
        </Alert>
      )}
    </Box>
  );
}

export default RaiseTicketForm;

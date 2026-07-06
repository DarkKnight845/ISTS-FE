import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";


const selectStyles = {
  bgcolor: "#F9FAFB",
  borderRadius: 2,
  height: 56,

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D0D5DD",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#98A2B3",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2859B8",
  },

  "& .MuiSelect-select": {
    py: 1.8,
    fontFamily: "General Sans",
  },
};


import CloseIcon from "@mui/icons-material/Close";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

type RaiseTicketModalProps = {
  open: boolean;
  onClose: () => void;
};

function RaiseTicketModal({
  open,
  onClose,
}: RaiseTicketModalProps) {
  return (
    <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    slotProps={{
        paper: {
        sx: {
            width: 720,
            maxWidth: "100vw",
            p: 4,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            bgcolor: "#FFFFFF",
            mt: 2,
            mr: 2,
            mb: 2,
            height: "calc(100% - 32px)",

            borderRadius: 4,
        },
        },
    }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          pb: 1,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontFamily: "General sans",
              color: "#101828",
            }}
          >
            Raise a support ticket
          </Typography>

          <Typography
            sx={{
              color: "#667085",
              fontFamily: "General sans",
              fontSize: 14,
              mt: 1,
              mb:2
            }}
          >
            Fill in as much detail as possible so the right team can help you
            quickly.
          </Typography>
        </Box>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box>

        <Box
            sx={{
                border: "1px solid #EAECF0",
                borderRadius: 3,
                p: 3,
            }}
        >

            {/* Ticket Subject */}

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
            placeholder="Summarize your issue in one sentence"
            sx={{
                "& .MuiOutlinedInput-root": {
                backgroundColor: "#F9FAFB", // Dark background
                color: "#FFFFFF",           // Text color
                borderRadius: 2,

                "& fieldset": {
                    borderColor: "#DDDDDD",   // Default border
                },

                "&:hover fieldset": {
                    borderColor: "#6B7280",
                },

                "&.Mui-focused fieldset": {
                    borderColor: "#2859B8",   // Focus border
                },
                },

                "& input::placeholder": {
                color: "#98A2B3",
                opacity: 1,
                fontFamily:"General sans"
                },
            }}
            />
            </Box>

            {/* Department + Category */}

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
                    fontFamily: "General sans",
                    fontWeight: 500,
                }}
                >
                Department
                </Typography>

                <FormControl fullWidth>
                <Select
                    displayEmpty
                    defaultValue=""
                    sx={selectStyles}

                >
                    <MenuItem value="">
                    Select Department
                    </MenuItem>

                    <MenuItem value="IT">
                    IT
                    </MenuItem>

                    <MenuItem value="HR">
                    HR
                    </MenuItem>

                    <MenuItem value="Finance">
                    Finance
                    </MenuItem>
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
                    defaultValue=""
                    sx={selectStyles}
                >
                    <MenuItem value="">
                    Select Category
                    </MenuItem>

                    <MenuItem value="Hardware">
                    Hardware
                    </MenuItem>

                    <MenuItem value="Software">
                    Software
                    </MenuItem>

                    <MenuItem value="Network">
                    Network
                    </MenuItem>
                </Select>
                </FormControl>
            </Box>
            </Box>

            {/* Description */}

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
                fullWidth
                multiline
                rows={6}
                placeholder="Provide detailed information about your issue..."
                sx={{
                    "& .MuiOutlinedInput-root": {
                    bgcolor: "#F9FAFB",
                    borderRadius: 2,

                    "& fieldset": {
                        borderColor: "#D0D5DD",
                    },

                    "&:hover fieldset": {
                        borderColor: "#98A2B3",
                    },

                    "&.Mui-focused fieldset": {
                        borderColor: "#2859B8",
                    },
                    },

                    "& textarea::placeholder": {
                    color: "#98A2B3",
                    opacity: 1,
                    fontFamily: "General sans"
                    },
                }}
            />

            </Box>
        </Box>

        {/* Priority */}
        <Box sx={{ mt: 4 }}>
        <Typography
            sx={{
            mb: 2,
            fontWeight: 500,
            color: "#101828",
            fontFamily: "General sans",
            }}
        >
            How urgent is this issue?
        </Typography>

        <Box
            sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            fontFamily: "General sans",
            }}
        >
            {/* Low */}
            <Box
            sx={{
                border: "1px solid #D0D5DD",
                borderRadius: 2,
                p: 3,
                cursor: "pointer",
                transition: "0.2s",

                "&:hover": {
                borderColor: "#2859B8",
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
                    bgcolor: "#16A34A",
                }}
                />

                <Typography sx={{ fontWeight: 500, fontFamily: "General sans" }}>
                Low
                </Typography>
            </Box>

            <Typography
                sx={{
                fontSize: 14,
                color: "#667085",
                fontFamily: "General sans",
                }}
            >
                General inquiry, no impact to your work
            </Typography>
            </Box>

            {/* Medium */}
            <Box
            sx={{
                border: "1px solid #D0D5DD",
                borderRadius: 2,
                p: 3,
                cursor: "pointer",

                "&:hover": {
                borderColor: "#2859B8",
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
                    bgcolor: "#EAB308",
                }}
                />

                <Typography sx={{ fontWeight: 500, fontFamily: "General sans" }}>
                Medium
                </Typography>
            </Box>

            <Typography
                sx={{
                fontSize: 14,
                color: "#667085",
                fontFamily: "General sans",
                }}
            >
                Affecting productivity, workaround available
            </Typography>
            </Box>

            {/* High */}
            <Box
            sx={{
                border: "1px solid #D0D5DD",
                borderRadius: 2,
                p: 3,
                cursor: "pointer",

                "&:hover": {
                borderColor: "#2859B8",
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
                    bgcolor: "#F59E0B",
                }}
                />

                <Typography sx={{ fontWeight: 500, fontFamily: "General sans" }}>
                High
                </Typography>
            </Box>

            <Typography
                sx={{
                fontSize: 14,
                color: "#667085",
                fontFamily: "General sans",
                }}
            >
                Significantly impacting your work, no workaround
            </Typography>
            </Box>

            {/* Urgent */}
            <Box
            sx={{
                border: "1px solid #D0D5DD",
                borderRadius: 2,
                p: 3,
                cursor: "pointer",

                "&:hover": {
                borderColor: "#2859B8",
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
                    bgcolor: "#DC2626",
                }}
                />

                <Typography sx={{ fontWeight: 500, fontFamily: "General sans" }}>
                Urgent
                </Typography>
            </Box>

            <Typography
                sx={{
                fontSize: 14,
                color: "#667085",
                fontFamily: "General sans",
                }}
            >
                Complete work stoppage or security risk
            </Typography>
            </Box>
        </Box>
        </Box>
        
        {/* Upload */}

        <Box sx={{ mt: 4 }}>
        <Typography
            sx={{
            mb: 1,
            fontWeight: 500,
            fontFamily: "General sans",
            }}
        >
            Attachment
        </Typography>

        <Box
            sx={{
            border: "2px dashed #D0D5DD",
            borderRadius: 3,
            py: 5,
            textAlign: "center",
            cursor: "pointer",

            "&:hover": {
                backgroundColor: "#F9FAFB",
            },
            }}
        >
            <UploadFileOutlinedIcon
            sx={{
                fontSize: 40,
                color: "#667085",
            }}
            />

            <Typography
            sx={{
                mt: 2,
                fontWeight: 500,
                fontFamily: "General sans",
            }}
            >
            Click to upload
            </Typography>

            <Typography
            sx={{
                color: "#667085",
                fontSize: 14,
                fontFamily: "General sans",
            }}
            >
            PNG, JPG or PDF up to 10MB
            </Typography>
        </Box>
        </Box>


        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 5,
            }}
            >
            <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                textTransform: "none",
                px: 4,
                borderRadius: 2,
                fontFamily: "General sans",
                }}
            >
                Cancel
            </Button>

            <Button
                variant="contained"
                sx={{
                textTransform: "none",
                px: 4,
                borderRadius: 2,
                bgcolor: "#2859B8",
                fontFamily: "General sans",

                "&:hover": {
                    bgcolor: "#214A99",
                },
                }}
            >
                Submit Ticket
            </Button>
            </Box>
      </Box>
    </Drawer>
  );
}

export default RaiseTicketModal;
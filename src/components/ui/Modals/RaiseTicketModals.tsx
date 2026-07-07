import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";

import { useState } from "react";

import { CloseIcon } from "@/components/icons";

import { keyframes } from "@mui/system";

import RaiseTicketForm, {
  type TicketFormData,
} from "@/components/ui/Modals/RaiseTicketForm";

type RaiseTicketModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => Promise<void> | void;
};

const slideIn = keyframes`
from{
    opacity:0;
    transform:translateX(60px);
}

to{
    opacity:1;
    transform:translateX(0);
}`;

function RaiseTicketModal({
  open,
  onClose,
  onSubmit,
}: RaiseTicketModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (data: TicketFormData) => {
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
    >
      <Box
        sx={{
          position: "fixed",
          fontFamily: "General sans",
          top: 24,
          right: 24,
          bottom: 24,

          width: 760,

          bgcolor: "background.paper",

          borderRadius: 5,

          overflow: "hidden",

          display: "flex",
          flexDirection: "column",

          boxShadow:
            "0px 24px 48px rgba(16,24,40,0.18)",

          animation: `${slideIn} .28s ease`,
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            px: 4,
            py: 3,

            display: "flex",

            justifyContent: "space-between",

            alignItems: "flex-start",

            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 600,
                fontFamily: "General sans",
              }}
            >
              Raise a support ticket
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "text.secondary",
                fontFamily: "General sans",
              }}
            >
              Fill in as much detail as possible so
              the right team can help you quickly.
            </Typography>
          </Box>

          <IconButton onClick={onClose} disabled={submitting} sx={{ color: 'text.secondary' }}>
            <CloseIcon size={22} />
          </IconButton>
        </Box>

        {/* BODY */}

        <Box
          sx={{
            flex: 1,

            overflowY: "auto",

            px: 4,

            py: 4,
          }}
        >
          <RaiseTicketForm onSubmit={handleSubmit} />
        </Box>

        {/* FOOTER */}

        <Box
          sx={{
            px: 4,
            py: 3,

            borderTop: `1px solid ${theme.palette.divider}`,

            display: "flex",

            justifyContent: "flex-end",

            gap: 2,
          }}
        >
          <Button
            variant="text"
            onClick={onClose}
            disabled={submitting}
            sx={{
              textTransform: "none",

              color: "text.secondary",

              fontWeight: 600,
              fontFamily: "General sans",
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="raise-ticket-form"
            variant="contained"
            disabled={submitting}
            startIcon={
              submitting ? (
                <CircularProgress size={16} sx={{ color: "inherit" }} />
              ) : undefined
            }
            sx={{
              textTransform: "none",

              px: 4,

              bgcolor: "primary.main",

              borderRadius: 2,

              boxShadow: "none",
              fontFamily: "General sans",

              "&:hover": {
                bgcolor: "primary.dark",
                boxShadow: "none",
              },
            }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default RaiseTicketModal;
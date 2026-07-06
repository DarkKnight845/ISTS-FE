import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { keyframes } from "@mui/system";
import  {type  Ticket } from "@/components/ui/types/ticket";

import RaiseTicketForm from "@/components/ui/Modals/RaiseTicketForm";

type RaiseTicketModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (ticket: Ticket) => void
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
  onSubmit
}: RaiseTicketModalProps) 

{
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

          bgcolor: "#FFFFFF",

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

            borderBottom: "1px solid #EAECF0",
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
                color: "#667085",
                fontFamily: "General sans",
              }}
            >
              Fill in as much detail as possible so
              the right team can help you quickly.
            </Typography>
          </Box>

          <IconButton onClick={onClose}>
            <CloseIcon />
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
          <RaiseTicketForm 
          onSubmit={onSubmit}
          />
        </Box>

        {/* FOOTER */}

        <Box
          sx={{
            px: 4,
            py: 3,

            borderTop: "1px solid #EAECF0",

            display: "flex",

            justifyContent: "flex-end",

            gap: 2,
          }}
        >
          <Button
            variant="text"
            onClick={onClose}
            sx={{
              textTransform: "none",

              color: "#344054",

              fontWeight: 600,
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

              bgcolor: "#2859B8",

              borderRadius: 2,

              boxShadow: "none",
              fontFamily: "General sans",

              "&:hover": {
                bgcolor: "#214A99",
                boxShadow: "none",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default RaiseTicketModal;
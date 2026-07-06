import { useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Avatar,
  Button,
  InputBase,
  Paper,
  Menu,
  MenuItem,
} from '@mui/material';
import type { Ticket, Message } from '../data/mockTickets';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#6B7280">
    <circle cx="12" cy="6" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="18" r="2" />
  </svg>
);

const AttachmentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21.44 11.05L12.25 20.24C11.12 21.37 9.63 22 8.08 22C6.53 22 5.04 21.37 3.91 20.24C2.78 19.11 2.15 17.62 2.15 16.07C2.15 14.52 2.78 13.03 3.91 11.9L13.1 2.71C13.83 1.98 14.79 1.57 15.79 1.57C16.79 1.57 17.75 1.98 18.48 2.71C19.21 3.44 19.62 4.4 19.62 5.4C19.62 6.4 19.21 7.36 18.48 8.09L9.25 17.32C8.89 17.68 8.39 17.88 7.87 17.88C7.35 17.88 6.85 17.68 6.49 17.32C6.13 16.96 5.93 16.46 5.93 15.94C5.93 15.42 6.13 14.92 6.49 14.56L15.66 5.39" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
}

function MessageBubble({ message }: { message: Message }) {
  const isAgent = message.sender === 'agent';
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isAgent ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '80%',
          backgroundColor: isAgent ? '#2559AA' : '#F3F4F6',
          color: isAgent ? '#fff' : '#374151',
          borderRadius: '12px',
          borderBottomRightRadius: isAgent ? '4px' : '12px',
          borderBottomLeftRadius: isAgent ? '12px' : '4px',
          px: 2,
          py: 1.5,
          fontSize: 13,
        }}
      >
        {message.text}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'right',
            mt: 0.75,
            color: isAgent ? 'rgba(255,255,255,0.7)' : '#9CA3AF',
            fontSize: 10,
          }}
        >
          {message.timestamp}
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * Slide-out ticket detail panel with chat and actions.
 */
function TicketDetailDrawer({ ticket, open, onClose }: TicketDetailDrawerProps) {
  const [reply, setReply] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!ticket) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 420 },
          p: 0,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            p: 3,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
              {ticket.id}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
              {ticket.subject}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: 12, backgroundColor: '#E5E7EB', color: '#374151' }}>
                {ticket.requester.charAt(0)}
              </Avatar>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                {ticket.requester}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ border: '1px solid #E5E7EB', borderRadius: '6px' }}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              slotProps={{
                paper: { sx: { minWidth: 160 } },
              }}
            >
              <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: 13 }}>Mark as complete</MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: 13, color: '#D97706' }}>Escalate</MenuItem>
            </Menu>
            <IconButton onClick={onClose} sx={{ border: '1px solid #E5E7EB', borderRadius: '6px' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Chat thread */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, backgroundColor: '#F9FAFB' }}>
          {ticket.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </Box>

        {/* Reply input */}
        <Box sx={{ p: 3, borderTop: '1px solid #E5E7EB', backgroundColor: '#fff' }}>
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              boxShadow: 'none',
              mb: 2,
            }}
          >
            <IconButton size="small" sx={{ color: '#6B7280' }}>
              <AttachmentIcon />
            </IconButton>
            <InputBase
              placeholder="Enter a reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              sx={{ flex: 1, fontSize: 14 }}
              multiline
              maxRows={3}
            />
            <IconButton
              size="small"
              sx={{
                backgroundColor: '#2559AA',
                color: '#fff',
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#1e4a8d' },
              }}
            >
              <SendIcon />
            </IconButton>
          </Paper>

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#2559AA',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 14,
              py: 1.25,
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#1e4a8d' },
            }}
          >
            Accept
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default TicketDetailDrawer;

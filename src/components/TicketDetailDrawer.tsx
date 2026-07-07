import { useEffect, useRef, useState } from 'react';
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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import * as signalR from '@microsoft/signalr';
import type { Ticket } from '../data/mockTickets';
import { useTicketMessages } from '@/hooks/useTicketMessages';
import {
  assignTicketRequest,
  escalateTicketRequest,
  sendTicketMessageRequest,
  updateTicketStatusRequest,
  type TicketMessageDto,
} from '@/lib/api';
import { joinTicketGroup, leaveTicketGroup } from '@/hooks/useSignalR';
import { CloseIcon, MoreIcon, AttachmentIcon, SendIcon } from '@/components/icons';

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  connection: signalR.HubConnection | null;
  onTicketUpdated?: (updatedTicket: Ticket) => void;
  /** When false the drawer skips the Accept step and shows chat immediately (staff view). */
  canAccept?: boolean;
  /** Current user's backend user id; used to align chat bubbles. */
  currentUserId?: string | null;
}

function formatMessageTime(value: string) {
  // Backend stores UTC but may serialize without a trailing Z. Force UTC parsing.
  const normalized = value.endsWith('Z') || value.endsWith('+00:00') ? value : `${value}Z`;
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function MessageBubble({ message, isMe }: { message: TicketMessageDto; isMe: boolean }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '80%',
          backgroundColor: isMe ? 'primary.main' : 'action.hover',
          color: isMe ? 'primary.contrastText' : 'text.primary',
          borderRadius: '12px',
          borderBottomRightRadius: isMe ? '4px' : '12px',
          borderBottomLeftRadius: isMe ? '12px' : '4px',
          px: 2,
          py: 1.5,
          fontSize: 13,
        }}
      >
        {message.message}
        {message.attachmentUrl && (
          <Box sx={{ mt: 1 }}>
            <a
              href={message.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: isMe ? '#BFDBFE' : 'primary.main', fontSize: 12 }}
            >
              Attachment
            </a>
          </Box>
        )}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'right',
            mt: 0.75,
            color: isMe ? 'rgba(255,255,255,0.7)' : 'text.secondary',
            fontSize: 10,
          }}
        >
          {message.senderName} • {formatMessageTime(message.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * Slide-out ticket detail panel with accept flow and real-time chat.
 */
function TicketDetailDrawer({ ticket, open, onClose, connection, onTicketUpdated, canAccept = true, currentUserId = null }: TicketDetailDrawerProps) {
  const [reply, setReply] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accepting, setAccepting] = useState(false);
  const [sending, setSending] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, loading: messagesLoading, error: messagesError, addMessage } = useTicketMessages(
    ticket?.backendId ?? null
  );

  const needsAccept = canAccept && ticket?.status === 'Active';
  const isChatEnabled = !needsAccept;

  useEffect(() => {
    if (open && ticket?.backendId && connection) {
      joinTicketGroup(connection, ticket.backendId);
    }
    return () => {
      if (ticket?.backendId && connection) {
        leaveTicketGroup(connection, ticket.backendId);
      }
    };
  }, [open, ticket?.backendId, connection]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setReply('');
      setAttachment(null);
      setActionError(null);
    }
  }, [open, ticket?.backendId]);

  if (!ticket) return null;

  const handleAccept = async () => {
    if (!currentUserId) {
      setActionError('Unable to identify current user. Please log in again.');
      return;
    }

    setAccepting(true);
    setActionError(null);
    try {
      await assignTicketRequest(ticket.backendId, currentUserId);
      const updated: Ticket = { ...ticket, status: 'Ongoing' };
      onTicketUpdated?.(updated);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to accept ticket');
    } finally {
      setAccepting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!reply.trim() && !attachment) return;

    setSending(true);
    setActionError(null);
    try {
      const sent = await sendTicketMessageRequest(ticket.backendId, reply.trim() || ' ', attachment, false);
      addMessage(sent);
      setReply('');
      setAttachment(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleConfirmComplete = async () => {
    setCompleting(true);
    setActionError(null);
    try {
      await updateTicketStatusRequest(ticket.backendId, 'Resolved');
      const updated: Ticket = { ...ticket, status: 'Resolved' };
      onTicketUpdated?.(updated);
      setCompleteDialogOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to mark ticket as complete');
    } finally {
      setCompleting(false);
    }
  };

  const handleConfirmEscalate = async () => {
    setEscalating(true);
    setActionError(null);
    try {
      await escalateTicketRequest(ticket.backendId);
      const updated: Ticket = { ...ticket, status: 'Active', assigned: null };
      onTicketUpdated?.(updated);
      setEscalateDialogOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to escalate ticket');
    } finally {
      setEscalating(false);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAttachment(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
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
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              {ticket.id}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {ticket.subject}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: 12, backgroundColor: 'divider', color: 'text.secondary' }}>
                {ticket.requester.charAt(0)}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {ticket.requester}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {canAccept && !needsAccept && (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '6px', color: 'text.secondary' }}
                >
                  <MoreIcon size={18} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  slotProps={{
                    paper: { sx: { minWidth: 160, backgroundColor: 'background.paper' } },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      setCompleteDialogOpen(true);
                    }}
                    sx={{ fontSize: 13 }}
                    disabled={ticket.status === 'Resolved' || ticket.status === 'Closed'}
                  >
                    Mark as complete
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      setEscalateDialogOpen(true);
                    }}
                    sx={{ fontSize: 13, color: 'warning.main' }}
                    disabled={ticket.status === 'Resolved' || ticket.status === 'Closed'}
                  >
                    Escalate
                  </MenuItem>
                </Menu>
              </>
            )}
            <IconButton onClick={onClose} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '6px', color: 'text.secondary' }}>
              <CloseIcon size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Ticket details before accept */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
          <DetailRow label="Status" value={ticket.status} />
          <DetailRow label="Priority" value={ticket.priority} />
          <DetailRow label="Assigned to" value={ticket.assigned ?? 'Unassigned'} />
          <DetailRow label="Created" value={ticket.createdAt} />
        </Box>

        {/* Chat thread */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, backgroundColor: 'background.default' }}>
          {messagesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} sx={{ color: 'primary.main' }} />
            </Box>
          ) : messagesError ? (
            <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center', mt: 4 }}>
              {messagesError}
            </Typography>
          ) : messages?.length ? (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isMe={message.senderUserId === currentUserId}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 4 }}>
              {isChatEnabled ? 'No messages yet. Start the conversation below.' : 'Accept the ticket to start chatting.'}
            </Typography>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Footer action area */}
        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
          {actionError && (
            <Typography sx={{ color: 'error.main', fontSize: '13px', mb: 2, textAlign: 'center' }}>
              {actionError}
            </Typography>
          )}

          {needsAccept ? (
            <Button
              fullWidth
              variant="contained"
              disabled={accepting}
              onClick={handleAccept}
              sx={{
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                py: 1.25,
                borderRadius: '10px',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              {accepting ? <CircularProgress size={20} sx={{ color: 'primary.contrastText' }} /> : 'Accept ticket'}
            </Button>
          ) : (
            <>
              <Paper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.75,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '10px',
                  boxShadow: 'none',
                  mb: 2,
                  backgroundColor: 'background.paper',
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={handleAttachmentClick}>
                  <AttachmentIcon size={20} />
                </IconButton>
                <InputBase
                  placeholder="Enter a reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={handleKeyDown}
                  sx={{ flex: 1, fontSize: 14, color: 'text.primary' }}
                  multiline
                  maxRows={3}
                />
                <IconButton
                  size="small"
                  onClick={handleSendMessage}
                  disabled={sending || (!reply.trim() && !attachment)}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    '&.Mui-disabled': { backgroundColor: 'action.disabledBackground', color: 'text.disabled' },
                  }}
                >
                  {sending ? <CircularProgress size={18} sx={{ color: 'primary.contrastText' }} /> : <SendIcon size={20} color="currentColor" />}
                </IconButton>
              </Paper>

              {attachment && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    backgroundColor: 'action.hover',
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 13, color: 'text.primary' }}>
                    {attachment.name}
                  </Typography>
                  <Button size="small" onClick={() => setAttachment(null)} sx={{ textTransform: 'none', color: 'text.secondary' }}>
                    Remove
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
      </Drawer>

      <Dialog
        open={completeDialogOpen}
        onClose={() => !completing && setCompleteDialogOpen(false)}
        slotProps={{
          paper: { sx: { borderRadius: '16px', p: 0, m: { xs: '16px', sm: '32px' }, width: { xs: '100%', sm: '360px' } } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '18px', color: 'text.primary', pt: 3, px: 3, pb: 1 }}>
          Mark ticket as complete?
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            This will mark the ticket as resolved and close the conversation.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            onClick={() => setCompleteDialogOpen(false)}
            disabled={completing}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmComplete}
            disabled={completing}
            sx={{
              textTransform: 'none',
              backgroundColor: 'primary.main',
              fontWeight: 500,
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            {completing ? <CircularProgress size={18} sx={{ color: 'primary.contrastText' }} /> : 'Mark as complete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={escalateDialogOpen}
        onClose={() => !escalating && setEscalateDialogOpen(false)}
        slotProps={{
          paper: { sx: { borderRadius: '16px', p: 0, m: { xs: '16px', sm: '32px' }, width: { xs: '100%', sm: '360px' } } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '18px', color: 'text.primary', pt: 3, px: 3, pb: 1 }}>
          Escalate ticket?
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            This will unassign the ticket and send it to the manager dashboard for reassignment.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            onClick={() => setEscalateDialogOpen(false)}
            disabled={escalating}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmEscalate}
            disabled={escalating}
            sx={{
              textTransform: 'none',
              backgroundColor: 'warning.main',
              fontWeight: 500,
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'warning.dark' },
            }}
          >
            {escalating ? <CircularProgress size={18} sx={{ color: 'primary.contrastText' }} /> : 'Escalate'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '13px', fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default TicketDetailDrawer;

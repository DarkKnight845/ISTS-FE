import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import * as signalR from '@microsoft/signalr';
import type { Ticket } from '@/components/ui/types/ticket';
import { useTicketMessages } from '@/hooks/useTicketMessages';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  assignTicketRequest,
  createRatingRequest,
  escalateTicketRequest,
  sendTicketMessageRequest,
  updateTicketStatusRequest,
  type TicketMessageDto,
} from '@/lib/api';
import { CloseIcon, MoreIcon, AttachmentIcon, SendIcon } from '@/components/icons';
import ConfirmDialog from './ui/ConfirmDialog';

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  connection: signalR.HubConnection | null;
  onTicketUpdated?: (updatedTicket: Ticket) => void;
  canAccept?: boolean;
  currentUserId?: string | null;
}

function formatMessageTime(value: string) {
  const normalized = value.endsWith('Z') || value.endsWith('+00:00') ? value : `${value}Z`;
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  Open: { bg: '#DBEAFE', text: '#1D4ED8' },
  Ongoing: { bg: '#FEF3C7', text: '#D97706' },
  Resolved: { bg: '#D1FAE5', text: '#059669' },
  Closed: { bg: '#E5E7EB', text: '#374151' },
  Waiting: { bg: '#D7EBFF', text: '#1565C0' },
};

function MessageBubble({
  message,
  isMe,
}: {
  message: TicketMessageDto;
  isMe: boolean;
}) {
  const isInternal = message.isInternal;
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
          backgroundColor: isInternal ? '#FEF3C7' : isMe ? 'primary.main' : 'background.paper',
          color: isInternal ? '#92400E' : isMe ? 'primary.contrastText' : 'text.primary',
          borderRadius: '14px',
          borderBottomRightRadius: isMe ? '4px' : '14px',
          borderBottomLeftRadius: isMe ? '14px' : '4px',
          border: isInternal ? '1px solid #FCD34D' : isMe ? 'none' : '1px solid',
          borderColor: isMe ? undefined : 'divider',
          px: 2,
          py: 1.5,
          fontSize: 13,
        }}
      >
        {isInternal && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontWeight: 700,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              mb: 0.5,
              color: '#B45309',
            }}
          >
            Internal note
          </Typography>
        )}
        {message.message && message.message !== 'Attachment' ? (
          message.message
        ) : message.attachmentUrl ? (
          <Typography
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontStyle: 'italic',
              opacity: 0.9,
            }}
          >
            Sent an attachment
          </Typography>
        ) : null}
        {message.attachmentUrl && (
          <Box sx={{ mt: 1 }}>
            <a
              href={message.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: isMe ? '#BFDBFE' : isInternal ? '#92400E' : 'primary.main',
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              View file
            </a>
          </Box>
        )}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'right',
            mt: 0.75,
            color: isInternal ? '#B45309' : isMe ? 'rgba(255,255,255,0.7)' : 'text.secondary',
            fontSize: 10,
          }}
        >
          {message.senderName} • {formatMessageTime(message.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
}

function TicketDetailDrawer({
  ticket,
  open,
  onClose,
  connection,
  onTicketUpdated,
  canAccept = true,
  currentUserId = null,
}: TicketDetailDrawerProps) {
  const { user: currentUser } = useCurrentUser();
  const [reply, setReply] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accepting, setAccepting] = useState(false);
  const [sending, setSending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [rating, setRating] = useState<number | null>(null);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, loading: messagesLoading, error: messagesError, addMessage } = useTicketMessages(
    ticket?.backendId ?? null,
    connection
  );

  const needsAccept = canAccept && ticket?.status === 'Open';
  const isChatEnabled = !needsAccept;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setRating(null);
    setRatingComment('');
    setRatingError(null);
    setRatingSubmitted(false);
  }, [ticket?.backendId]);

  if (!ticket) return null;

  const handleClose = () => {
    setReply('');
    setAttachment(null);
    setActionError(null);
    setRating(null);
    setRatingComment('');
    setRatingError(null);
    onClose();
  };

  const handleAccept = async () => {
    if (!currentUserId) {
      setActionError('Unable to identify current user. Please log in again.');
      return;
    }
    setAccepting(true);
    setActionError(null);
    try {
      const updated = await assignTicketRequest(ticket.backendId, currentUserId);
      const assignedName = updated.assignedAgentName || currentUser?.fullName || 'Assigned';
      onTicketUpdated?.({ ...ticket, status: 'Ongoing', assigned: assignedName });
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
    try {
      await updateTicketStatusRequest(ticket.backendId, 'Resolved');
      onTicketUpdated?.({ ...ticket, status: 'Resolved' });
      setCompleteDialogOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to mark ticket as complete');
    }
  };

  const handleConfirmEscalate = async () => {
    try {
      await escalateTicketRequest(ticket.backendId);
      onTicketUpdated?.({ ...ticket, status: 'Open', assigned: null });
      setEscalateDialogOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to escalate ticket');
    } finally {
    }
  };

  const handleAttachmentClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAttachment(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canRate =
    Boolean(currentUserId) &&
    ticket.requesterId === currentUserId &&
    (ticket.status === 'Resolved' || ticket.status === 'Closed') &&
    !ticket.isRated;

  const handleSubmitRating = async () => {
    if (!rating) return;
    setRatingSubmitting(true);
    setRatingError(null);
    try {
      await createRatingRequest({ ticketId: ticket.backendId, rating, comment: ratingComment.trim() });
      setRatingSubmitted(true);
      onTicketUpdated?.({ ...ticket, isRated: true });
      setTimeout(() => setRatingSubmitted(false), 3000);
    } catch (err) {
      setRatingError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const status = statusStyles[ticket.status] || statusStyles.Waiting;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        slotProps={{
          root: {
            sx: {
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(15, 23, 42, 0.25)',
                backdropFilter: 'blur(4px)',
              },
            },
          },
          paper: {
            sx: {
              width: { xs: '100%', sm: 440 },
              p: 0,
              boxShadow: 5,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 36, height: 36, fontSize: 13, backgroundColor: 'action.selected', color: 'text.secondary' }}>
                {ticket.requester.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '17px' }}>
                  {ticket.subject}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    TKT-{ticket.id.slice(0, 3).toUpperCase()}
                  </Typography>
                  <Chip
                    label={ticket.status}
                    size="small"
                    sx={{
                      backgroundColor: status.bg,
                      color: status.text,
                      fontWeight: 700,
                      fontSize: '11px',
                      height: 20,
                      borderRadius: '10px',
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {canAccept && !needsAccept && (
                <>
                  <IconButton
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '10px', color: 'text.secondary' }}
                  >
                    <MoreIcon size={18} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    slotProps={{
                      paper: { sx: { minWidth: 180, borderRadius: '10px', boxShadow: 4 } },
                    }}
                  >
                    <MenuItem
                      onClick={() => { setAnchorEl(null); setCompleteDialogOpen(true); }}
                      sx={{ fontSize: 13, fontWeight: 500 }}
                      disabled={ticket.status === 'Resolved' || ticket.status === 'Closed'}
                    >
                      Mark as complete
                    </MenuItem>
                    <MenuItem
                      onClick={() => { setAnchorEl(null); setEscalateDialogOpen(true); }}
                      sx={{ fontSize: 13, fontWeight: 600, color: 'warning.main' }}
                      disabled={ticket.status === 'Resolved' || ticket.status === 'Closed'}
                    >
                      Escalate to manager
                    </MenuItem>
                  </Menu>
                </>
              )}
              <IconButton
                onClick={handleClose}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '10px', color: 'text.secondary' }}
              >
                <CloseIcon size={20} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
            <DetailRow label="Priority" value={ticket.priority} />
            <DetailRow label="Assigned to" value={ticket.assigned ?? 'Unassigned'} />
            <DetailRow label="Created" value={ticket.createdAt} />
          </Box>

          {canRate && (
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Rate this resolution
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13, mb: 1.5 }}>
                How would you rate the support you received?
              </Typography>
              <Rating value={rating} onChange={(_e, value) => setRating(value)} sx={{ mb: 1.5 }} />
              <TextField
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                placeholder="Add a comment (optional)"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                sx={{
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': { fontSize: 14, backgroundColor: 'background.default', borderRadius: '10px' },
                }}
              />
              {ratingError && (
                <Typography sx={{ color: 'error.main', fontSize: '13px', mb: 1.5 }}>{ratingError}</Typography>
              )}
              <Button
                variant="contained"
                disabled={!rating || ratingSubmitting}
                onClick={handleSubmitRating}
                sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 600 }}
              >
                Submit rating
              </Button>
            </Box>
          )}

          {ratingSubmitted && (
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'success.light' }}>
              <Typography sx={{ color: 'success.dark', fontSize: 14, fontWeight: 600 }}>Thanks for your feedback!</Typography>
            </Box>
          )}

          <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.75 }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 14, lineHeight: 1.7, mb: ticket.attachmentUrl ? 2 : 0 }}>
              {ticket.description || 'No description provided.'}
            </Typography>

            {ticket.attachmentUrl && (
              <Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                  Attachment
                </Typography>
                <Box
                  component="img"
                  src={ticket.attachmentUrl}
                  alt="Ticket attachment"
                  onClick={() => {
                    if (ticket.attachmentUrl) window.open(ticket.attachmentUrl, '_blank');
                  }}
                  sx={{
                    width: '100%',
                    maxHeight: 220,
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.95 },
                  }}
                />
              </Box>
            )}
          </Box>

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
                <MessageBubble key={message.id} message={message} isMe={message.senderUserId === currentUserId} />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 4 }}>
                {isChatEnabled ? 'No messages yet. Start the conversation below.' : 'Accept the ticket to start chatting.'}
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>

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
                {accepting ? 'Accepting…' : 'Accept ticket'}
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
                    borderRadius: '12px',
                    boxShadow: 'none',
                    mb: 2,
                    backgroundColor: 'background.paper',
                  }}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
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
                      borderRadius: '10px',
                      width: 36,
                      height: 36,
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
                      borderRadius: '10px',
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

      <ConfirmDialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        onConfirm={handleConfirmComplete}
        title="Mark ticket as complete?"
        message="This will mark the ticket as resolved and close the conversation."
        confirmText="Mark as complete"
      />

      <ConfirmDialog
        open={escalateDialogOpen}
        onClose={() => setEscalateDialogOpen(false)}
        onConfirm={handleConfirmEscalate}
        title="Escalate ticket?"
        message="This will unassign the ticket and send it to the manager dashboard for reassignment."
        confirmText="Escalate"
        confirmColor="warning"
      />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '13px', fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default TicketDetailDrawer;

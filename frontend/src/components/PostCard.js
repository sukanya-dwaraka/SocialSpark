import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, Box, Avatar, Typography,
  IconButton, TextField, Button, Collapse, Divider, Menu,
  MenuItem, ListItemIcon, Tooltip, Chip,
} from '@mui/material';
import {
  FavoriteBorder, Favorite, ChatBubbleOutline, MoreVert,
  Delete, Send, ExpandMore, ExpandLess,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function PostCard({ post, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isLiked = user && post.likes?.some((l) => l.userId === user._id);
  const isOwner = user && post.userId === user._id;

  const handleLike = async () => {
    if (!user || likeLoading) return;
    setLikeLoading(true);
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      onUpdate(post._id, { likes: data.likes });
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      onUpdate(post._id, {
        comments: [...(post.comments || []), data.comment],
      });
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  const initials = post.username?.[0]?.toUpperCase() || 'U';
  const avatarColors = [
    'linear-gradient(135deg, #4F46E5, #818CF8)',
    'linear-gradient(135deg, #EC4899, #F472B6)',
    'linear-gradient(135deg, #10B981, #34D399)',
    'linear-gradient(135deg, #F59E0B, #FBBF24)',
    'linear-gradient(135deg, #3B82F6, #60A5FA)',
  ];
  const colorIdx = post.username?.charCodeAt(0) % avatarColors.length || 0;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        border: '1px solid #E2E8F0',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
      }}
    >
      <CardContent sx={{ pb: 0 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                background: avatarColors[colorIdx],
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {post.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {timeAgo(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          {isOwner && (
            <>
              <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
              >
                <MenuItem onClick={handleDelete} sx={{ color: '#EF4444' }}>
                  <ListItemIcon><Delete fontSize="small" sx={{ color: '#EF4444' }} /></ListItemIcon>
                  Delete Post
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Text content */}
        {post.text && (
          <Typography variant="body1" sx={{ mb: post.image ? 2 : 0, color: '#334155', lineHeight: 1.7 }}>
            {post.text}
          </Typography>
        )}

        {/* Image */}
        {post.image && (
          <Box
            component="img"
            src={`${API_BASE}${post.image}`}
            alt="Post"
            sx={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'cover',
              borderRadius: 3,
              display: 'block',
              mt: post.text ? 0 : 0,
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </CardContent>

      {/* Stats row */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'flex', gap: 2 }}>
        {post.likes?.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            <strong>{post.likes.length}</strong> {post.likes.length === 1 ? 'like' : 'likes'}
          </Typography>
        )}
        {post.comments?.length > 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ cursor: 'pointer', '&:hover': { color: '#4F46E5' } }}
            onClick={() => setShowComments(!showComments)}
          >
            <strong>{post.comments.length}</strong> {post.comments.length === 1 ? 'comment' : 'comments'}
          </Typography>
        )}
      </Box>

      <Divider sx={{ mx: 2, mt: 1 }} />

      {/* Action buttons */}
      <CardActions sx={{ px: 1, py: 0.5 }}>
        <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
          <IconButton
            onClick={handleLike}
            disabled={!user || likeLoading}
            sx={{
              color: isLiked ? '#EC4899' : '#64748B',
              borderRadius: 2,
              px: 2,
              gap: 0.5,
              '&:hover': {
                bgcolor: isLiked ? '#FDF2F8' : '#F8FAFC',
                color: '#EC4899',
              },
            }}
          >
            {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            <Typography variant="caption" fontWeight={600}>
              Like
            </Typography>
          </IconButton>
        </Tooltip>

        <IconButton
          onClick={() => setShowComments(!showComments)}
          sx={{
            color: '#64748B',
            borderRadius: 2,
            px: 2,
            gap: 0.5,
            '&:hover': { bgcolor: '#F8FAFC', color: '#4F46E5' },
          }}
        >
          <ChatBubbleOutline fontSize="small" />
          <Typography variant="caption" fontWeight={600}>
            Comment
          </Typography>
        </IconButton>
      </CardActions>

      {/* Comments section */}
      <Collapse in={showComments}>
        <Box sx={{ px: 2, pb: 2 }}>
          <Divider sx={{ mb: 2 }} />

          {/* Existing comments */}
          {post.comments?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {post.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    mb: 1.5,
                    '&:last-child': { mb: 0 },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.75rem',
                      background: avatarColors[comment.username?.charCodeAt(0) % avatarColors.length || 0],
                      flexShrink: 0,
                    }}
                  >
                    {comment.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box
                    sx={{
                      bgcolor: '#F8FAFC',
                      borderRadius: '4px 16px 16px 16px',
                      px: 2,
                      py: 1,
                      flex: 1,
                    }}
                  >
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#4F46E5' }}>
                      {comment.username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#334155', mt: 0.25 }}>
                      {comment.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {timeAgo(comment.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Add comment */}
          {user ? (
            <Box component="form" onSubmit={handleComment} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', flexShrink: 0 }}>
                {user.username?.[0]?.toUpperCase()}
              </Avatar>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#F8FAFC',
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleComment(e);
                  }
                }}
              />
              <IconButton
                type="submit"
                disabled={!commentText.trim() || commentLoading}
                sx={{
                  bgcolor: '#4F46E5',
                  color: '#fff',
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#3730A3' },
                  '&:disabled': { bgcolor: '#E2E8F0' },
                  flexShrink: 0,
                }}
              >
                <Send fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
              Log in to comment
            </Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );
}

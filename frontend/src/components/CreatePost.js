import React, { useState, useRef } from 'react';
import {
  Card, CardContent, Box, Avatar, TextField, Button,
  IconButton, Typography, CircularProgress, Alert, Chip,
} from '@mui/material';
import { Image, Close, Send } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!text.trim() && !imageFile) {
      setError('Please add some text or an image');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (imageFile) formData.append('image', imageFile);

      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setText('');
      removeImage();
      onPostCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.username?.[0]?.toUpperCase() || 'U';
  const charCount = text.length;
  const maxChars = 1000;

  return (
    <Card elevation={0} sx={{ mb: 2.5, border: '1px solid #E2E8F0' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar sx={{ width: 44, height: 44, fontSize: '1rem', flexShrink: 0 }}>
            {initials}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              placeholder={`What's on your mind, ${user?.username}?`}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, maxChars))}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '1rem',
                  '&::placeholder': { color: '#94A3B8' },
                },
              }}
              sx={{
                mb: 1,
                '& .MuiInputBase-root': {
                  padding: 0,
                },
              }}
            />

            {/* Image preview */}
            {imagePreview && (
              <Box sx={{ position: 'relative', mb: 2, display: 'inline-block' }}>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    borderRadius: 3,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={removeImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            )}

            {/* Actions row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 1.5,
                borderTop: '1px solid #F1F5F9',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current.click()}
                  sx={{
                    color: '#4F46E5',
                    bgcolor: '#EEF2FF',
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#E0E7FF' },
                  }}
                >
                  <Image />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  Add Photo
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {charCount > 0 && (
                  <Typography
                    variant="caption"
                    color={charCount > 900 ? 'error' : 'text.secondary'}
                  >
                    {charCount}/{maxChars}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  size="small"
                  endIcon={loading ? null : <Send sx={{ fontSize: '1rem !important' }} />}
                  onClick={handleSubmit}
                  disabled={loading || (!text.trim() && !imageFile)}
                  sx={{ px: 2.5, py: 1, borderRadius: 3 }}
                >
                  {loading ? <CircularProgress size={18} color="inherit" /> : 'Post'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

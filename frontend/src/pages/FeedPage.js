import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, CircularProgress, Button, Alert,
  Skeleton, Card, CardContent,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function PostSkeleton() {
  return (
    <Card elevation={0} sx={{ mb: 2, border: '1px solid #E2E8F0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <Skeleton variant="circular" width={42} height={42} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="30%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton width="20%" height={16} />
          </Box>
        </Box>
        <Skeleton height={20} sx={{ mb: 1 }} />
        <Skeleton height={20} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mt: 1 }} />
      </CardContent>
    </Card>
  );
}

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      const { data } = await api.get(`/posts?page=${pageNum}&limit=10`);
      if (append) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setHasMore(pageNum < data.totalPages);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchPosts(nextPage, true);
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handlePostUpdate = (postId, updates) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, ...updates } : p))
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F1F5F9' }}>
      <Navbar />

      <Box
        sx={{
          maxWidth: 680,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: 3,
        }}
      >
        {/* Welcome banner */}
        {user && (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
              borderRadius: 4,
              p: 3,
              mb: 3,
              color: '#fff',
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
              Hey, {user.username}! 👋
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Share what's on your mind with the community
            </Typography>
          </Box>
        )}

        {/* Create post */}
        {user && <CreatePost onPostCreated={handlePostCreated} />}

        {/* Feed header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, mt: 1 }}>
          <Typography variant="h6" fontWeight={800} color="text.primary">
            Latest Posts
          </Typography>
          <Button
            startIcon={<Refresh />}
            size="small"
            onClick={() => { setLoading(true); setPage(1); fetchPosts(1, false); }}
            sx={{ color: '#4F46E5', fontWeight: 600, borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Posts */}
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography fontSize="3rem" mb={2}>✨</Typography>
            <Typography variant="h6" fontWeight={700} mb={1}>No posts yet</Typography>
            <Typography color="text.secondary">
              Be the first to share something!
            </Typography>
          </Box>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handlePostDelete}
                onUpdate={handlePostUpdate}
              />
            ))}

            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  sx={{ borderColor: '#E2E8F0', color: '#4F46E5', borderRadius: 3, px: 4 }}
                >
                  {loadingMore ? <CircularProgress size={20} /> : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

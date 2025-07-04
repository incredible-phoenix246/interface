import {
  ArrowForward as ArrowForwardIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type React from 'react';
import { useEffect, useState } from 'react';

import { useProfileStore } from './profile-store';

const API_BASE_URL = 'https://testnet-api.eden-finance.xyz/api/v1';

export default function ProfilePage() {
  const {
    username,
    firstName,
    lastName,
    points,
    referrals,
    avatar,
    connections,
    referralCodes,
    maxReferralCodes,
    updateProfile,
    toggleConnection,
    generateReferralCode,
    setCustomReferralDialog,
    deleteReferralCode,
  } = useProfileStore();

  const [formData, setFormData] = useState({
    username,
    firstName,
    lastName,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await res.json();
        console.log('Fetched profile:', result);

        if (res.ok && result.status && result.data) {
          const data = result.data;

          useProfileStore.setState((state) => ({
            ...state,
            username: data.username || '',
            avatar: data.avatar || '/placeholder.svg?height=80&width=80',
            points: data.lifetimePoints || 0,
            referrals: data.referredCount || 0,
            referralCodes: data.referralCode ? [{ code: data.referralCode, used: false }] : [],
          }));

          setFormData({
            username: data.username || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const result = await res.json();
      console.log('Profile updated:', result);

      if (res.ok && result.status) {
        updateProfile({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        setIsEditing(false); // Disable editing after saving
      } else {
        console.error('Failed to update profile:', result.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleGenerateCode = () => {
    if (referralCodes.length >= maxReferralCodes) return;
    generateReferralCode();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCustomReferral = () => {
    setCustomReferralDialog(true);
    handleMenuClose();
  };

  return (
    <Box sx={{ minHeight: '100vh', color: 'white' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar src={avatar} sx={{ width: 80, height: 80, bgcolor: '#10b981' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#10b981', borderRadius: '50%' }} />
                <Typography
                  // @ts-expect-error next line
                  variant="body2"
                >
                  {points} Points
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<ArrowForwardIcon />}
                sx={{ color: '#60a5fa', p: 0, textTransform: 'none' }}
              >
                See Leaderboard
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 2,
              minWidth: 400,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: '#6b7280' }} />
                <Typography
                  // @ts-expect-error next line
                  variant="body2"
                  sx={{ color: '#6b7280' }}
                >
                  Referrals
                </Typography>
                <Chip
                  label={referrals}
                  size="small"
                  sx={{ bgcolor: '#7c3aed', color: 'white', minWidth: 24 }}
                />
              </Box>

              <Button
                variant="outlined"
                onClick={handleMenuClick}
                endIcon={<MoreVertIcon />}
                sx={{
                  borderColor: '#10b981',
                  color: '#10b981',
                  '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16, 185, 129, 0.1)' },
                }}
              >
                Generate Referral Code •
                {(referralCodes && maxReferralCodes - referralCodes.length) ?? 0} left
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: '#1f2937',
                    color: 'white',
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem onClick={handleCustomReferral}>Custom Referral Code</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleGenerateCode();
                    handleMenuClose();
                  }}
                >
                  System-generated
                </MenuItem>
              </Menu>
            </Box>

            {referralCodes && referralCodes.length > 0 && (
              <Box sx={{ width: '100%' }}>
                {referralCodes.map((code, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1.5,
                      px: 2,
                      mb: 1,
                      bgcolor: '#1f2937',
                      borderRadius: 1,
                      border: '1px solid #374151',
                    }}
                  >
                    <Typography
                      // @ts-expect-error next line
                      variant="body2"
                      sx={{ color: 'white', fontFamily: 'monospace' }}
                    >
                      {code.code}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {code.used && (
                        <Chip
                          label="Used"
                          size="small"
                          sx={{
                            bgcolor: '#10b981',
                            color: 'white',
                            fontSize: '0.75rem',
                            height: 20,
                          }}
                        />
                      )}
                      <Button
                        size="small"
                        sx={{
                          color: '#6b7280',
                          minWidth: 'auto',
                          p: 0.5,
                          '&:hover': { bgcolor: 'rgba(107, 114, 128, 0.1)' },
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </Button>
                      <Button
                        size="small"
                        onClick={() => deleteReferralCode(index)}
                        sx={{
                          color: '#ef4444',
                          minWidth: 'auto',
                          p: 0.5,
                          '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                bgcolor: '#1f2937',
                p: 3,
                borderRadius: 2,
                border: '1px solid #374151',
                height: 'fit-content',
              }}
            >
              <Typography
                // @ts-expect-error next line
                variant="h6"
                sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}
              >
                Profile Details
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {['username', 'firstName', 'lastName'].map((field) => (
                  <Box key={field}>
                    <Typography
                      // @ts-expect-error next line
                      variant="body2"
                      sx={{ mb: 1, color: '#9ca3af' }}
                    >
                      {field === 'firstName'
                        ? 'First Name'
                        : field === 'lastName'
                        ? 'Last Name'
                        : 'Username'}
                    </Typography>
                    <TextField
                      fullWidth
                      disabled={!isEditing}
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#111827',
                          color: 'white',
                          '& fieldset': { borderColor: '#374151' },
                          '&:hover fieldset': { borderColor: '#6b7280' },
                          '&.Mui-focused fieldset': { borderColor: '#10b981' },
                        },
                      }}
                    />
                  </Box>
                ))}

                {isEditing ? (
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    fullWidth
                    sx={{
                      bgcolor: '#6366f1',
                      '&:hover': { bgcolor: '#5b21b6' },
                      py: 1.5,
                      borderRadius: 1,
                      mt: 1,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(true)}
                    fullWidth
                    sx={{
                      borderColor: '#10b981',
                      color: '#10b981',
                      '&:hover': {
                        borderColor: '#059669',
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                      },
                      py: 1.5,
                      borderRadius: 1,
                      mt: 1,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                bgcolor: '#1f2937',
                p: 3,
                borderRadius: 2,
                border: '1px solid #374151',
                height: 'fit-content',
              }}
            >
              <Typography
                // @ts-expect-error next line
                variant="h6"
                sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}
              >
                Connections
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {connections &&
                  connections.map((connection) => (
                    <Box
                      key={connection.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 2,
                        px: 0,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center' }}>
                          {connection.id === 'wallet' && '💎'}
                          {connection.id === 'twitter' && '𝕏'}
                          {connection.id === 'discord' && '💬'}
                        </Box>
                        <Typography
                          // @ts-expect-error next line
                          variant="body1"
                          sx={{ color: 'white', fontWeight: 500 }}
                        >
                          {connection.username || connection.name}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toggleConnection(connection.id)}
                        sx={{
                          borderColor: '#6b7280',
                          color: '#6b7280',
                          textTransform: 'none',
                          fontSize: '0.875rem',
                          '&:hover': {
                            borderColor: '#4b5563',
                            bgcolor: 'rgba(107, 114, 128, 0.1)',
                          },
                        }}
                      >
                        {connection.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </Box>
                  ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

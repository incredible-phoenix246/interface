'use client';

import {
  ArrowForward as ArrowForwardIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
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
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { useProfileStore } from '../../store/profileSlice';

const API_BASE_URL = 'https://testnet-api.eden-finance.xyz/api/v1';

export default function ProfilePage() {
  const {
    username,
    firstName,
    lastName,
    points,
    referrals,
    avatar,
    referralCodes,
    maxReferralCodes,
    updateProfile,
    generateReferralCode,
    setCustomReferralDialog,
    deleteReferralCode,
  } = useProfileStore();

  const { signUpdateProfile, currentAccount } = useWeb3Context();

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

    const timestamp = new Date().toISOString();
    const signature = await signUpdateProfile({
      username: formData.username,
      account: currentAccount,
      timestamp,
    });

    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          timestamp,
          signature,
        }),
      });

      const result = await res.json();

      if (res.ok && result.status) {
        updateProfile({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        setIsEditing(false);
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
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 4, lg: 6 }, px: { xs: 2, md: 3 }, mt: { xs: 4, lg: 10 } }}
      >
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'flex-start', lg: 'flex-start' },
            justifyContent: 'space-between',
            gap: { xs: 3, lg: 0 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
            <Avatar
              src={avatar}
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                bgcolor: '#10b981',
              }}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '1.5rem', md: '2.125rem' },
                }}
              >
                {username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#10b981', borderRadius: '50%' }} />
                <Typography
                  // @ts-expect-error next line
                  variant="body2"
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  {points} Points
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  color: '#60a5fa',
                  p: 0,
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                See Leaderboard
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', lg: 'flex-end' },
              gap: 2,
              width: { xs: '100%', lg: 'auto' },
              minWidth: { lg: 400 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                width: '100%',
                flexDirection: { xs: 'row', sm: 'row' },
                justifyContent: 'space-between',
                // @ts-expect-error next line
                alignItems: { xs: 'center', sm: 'center' },
              }}
            >
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
                variant="gradient"
                onClick={handleMenuClick}
                // endIcon={<MoreVertIcon />}
                sx={{
                  // borderColor: '#10b981',
                  // color: '#10b981',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16, 185, 129, 0.1)' },
                }}
              >
                Generate Referral Code
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
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} lg={6}>
            <Paper
              sx={{
                bgcolor: '#1f2937',
                p: { md: 6, xs: 4 },
                borderRadius: 2,
                border: '1px solid #374151',
                height: 'fit-content',
              }}
            >
              <Typography
                // @ts-expect-error next line
                variant="h6"
                sx={{
                  mb: 7,
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                }}
              >
                Profile Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {['username'].map((field) => (
                  <Box key={field}>
                    <Typography
                      // @ts-expect-error next line
                      variant="body2"
                      sx={{ mb: 2, color: '#9ca3af' }}
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
                          // bgcolor: '#111827',
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
                    size="large"
                    sx={{
                      mt: 1,
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                    }}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    fullWidth
                    size="large"
                    sx={{
                      mt: 1,
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper
              sx={{
                bgcolor: '#1f2937',
                p: { md: 6, xs: 4 },
                borderRadius: 2,
                border: '1px solid #374151',
                height: 'fit-content',
              }}
            >
              <Typography
                // @ts-expect-error next line
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                }}
              >
                Referrals & Connections
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

                          mb: 1,
                          flexDirection: { xs: 'row', sm: 'row' },
                          gap: { xs: 1, sm: 0 },
                        }}
                      >
                        <Typography
                          // @ts-expect-error next line
                          variant="body2"
                          sx={{
                            color: 'white',
                            fontFamily: 'monospace',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            wordBreak: 'break-all',
                          }}
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
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

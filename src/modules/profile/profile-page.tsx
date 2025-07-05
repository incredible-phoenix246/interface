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
import { useState } from 'react';

import CustomReferralDialog from './custom-referral-dialog';
import { useProfileStore } from './profile-store';
import SignatureRequestModal from './signature-request-modal';

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
    openSignatureRequest,
    setCustomReferralDialog,
    deleteReferralCode,
  } = useProfileStore();

  const [formData, setFormData] = useState({
    username,
    firstName,
    lastName,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSave = () => {
    updateProfile(formData);
    openSignatureRequest('username', formData.username);
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

  //   const canGenerateCode = referralCodes.length < maxReferralCodes;

  return (
    <Box sx={{ minHeight: '100vh', color: 'white' }}>
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 4, lg: 6 }, px: { xs: 2, md: 3 }, mt: { xs: 8, lg: 8 } }}
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'stretch', lg: 'flex-start' },
            justifyContent: { xs: 'flex-start', lg: 'space-between' },
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
              alignItems: { xs: 'stretch', lg: 'flex-end' },
              gap: 2,
              minWidth: { xs: 'auto', lg: 400 },
              width: { xs: '100%', lg: 'auto' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: '#6b7280' }} />
                <Typography
                  // @ts-expect-error next line
                  variant="body2"
                >
                  Referrals
                </Typography>
                <Chip label={referrals} size="small" sx={{ color: 'white', minWidth: 24 }} />
              </Box>

              <Button
                variant="outlined"
                onClick={handleMenuClick}
                endIcon={<MoreVertIcon />}
                sx={{
                  borderColor: '#10b981',
                  color: '#10b981',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 2, sm: 3 },
                  '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16, 185, 129, 0.1)' },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Generate Referral Code • {maxReferralCodes - referralCodes.length} left
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Generate Code • {maxReferralCodes - referralCodes.length} left
                </Box>
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

            {/* Referral Codes List - positioned in right side area */}
            {referralCodes.length > 0 && (
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
                      sx={{
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
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
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ alignItems: 'stretch' }}>
          {/* Profile Details */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Paper
              sx={{
                bgcolor: '#1f2937',
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                border: '1px solid #374151',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                // @ts-expect-error next line
                variant="h6"
                sx={{
                  mb: { xs: 4, md: 8 },
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                }}
              >
                Profile Details
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1 }}>
                <Box>
                  <Typography
                    // @ts-expect-error next line
                    variant="body2"
                    sx={{ mb: 1, color: '#9ca3af' }}
                  >
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#111827',
                        color: 'white',
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        '& fieldset': { borderColor: '#374151' },
                        '&:hover fieldset': { borderColor: '#6b7280' },
                        '&.Mui-focused fieldset': { borderColor: '#10b981' },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    fullWidth
                    sx={{
                      py: { xs: 1.25, md: 1.5 },
                      borderRadius: 1,
                      mt: 1,
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Connections */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <Paper
              sx={{
                bgcolor: '#1f2937',
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                border: '1px solid #374151',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                // @ts-expect-error next line
                variant="h6"
                sx={{
                  mb: { xs: 4, md: 8 },
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                }}
              >
                Connections
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                {connections.map((connection) => (
                  <Box
                    key={connection.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: { xs: 1.5, md: 2 },
                      px: 0,
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          flexShrink: 0,
                        }}
                      >
                        {connection.id === 'wallet' && '💎'}
                        {connection.id === 'twitter' && '𝕏'}
                        {connection.id === 'discord' && '💬'}
                      </Box>
                      <Typography
                        // @ts-expect-error next line
                        variant="body1"
                        sx={{
                          color: 'white',
                          fontWeight: 500,
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {connection.connected ? connection.username : connection.name}
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
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        px: { xs: 1.5, md: 2 },
                        py: { xs: 0.5, md: 0.75 },
                        flexShrink: 0,
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

      <SignatureRequestModal />
      <CustomReferralDialog />
    </Box>
  );
}

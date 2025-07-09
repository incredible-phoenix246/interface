'use client';

// import { Close as CloseIcon } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // IconButton,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { useProfileStore } from '../../store/profileSlice';

const API_BASE_URL = 'https://testnet-api.eden-finance.xyz/api/v1';

export default function CustomReferralDialog() {
  const router = useRouter();
  const {
    customReferralDialog,
    customReferralCode,
    setCustomReferralDialog,
    setCustomReferralCode,
  } = useProfileStore();

  const { currentAccount, signReferalTxData, signAuthTxData } = useWeb3Context();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const authAttemptedRef = useRef<string | null>(null);
  const hasAttemptedAuth = authAttemptedRef.current === currentAccount;

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const checkWalletReferralCode = useCallback(async (walletAddress: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/wallet/${walletAddress}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      console.log('Wallet referral code check result:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to check wallet referral code');
      }
      const hasReferral = result.data?.hasReferral;
      const referralCode = result.data?.referralCode;
      return hasReferral && referralCode ? referralCode : false;
    } catch (error) {
      console.error('Error checking wallet referral code:', error);
      return false;
    }
  }, []);

  const authenticateUser = useCallback(async () => {
    if (!currentAccount || !signAuthTxData) return null;

    try {
      const timestamp = new Date().toISOString();
      const authMessage = `Authenticate: ${timestamp}`;
      const authSignature = await signAuthTxData(authMessage);

      const response = await fetch(`${API_BASE_URL}/user/wallet/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: currentAccount,
          timestamp,
          signature: authSignature,
        }),
      });

      const result = await response.json();

      console.log('Authentication result:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed');
      }

      const token = result.data?.token;

      if (token) {
        localStorage.setItem('access_token', token);
        router.reload();
        setIsAuthenticated(true);
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }, [currentAccount, signAuthTxData]);

  const linkReferralCode = useCallback(
    async (referralCode: string) => {
      if (!currentAccount || !signReferalTxData || !referralCode.trim()) return null;

      try {
        const linkMessage = 'Link referral for EdenFinance';
        const linkSignature = await signReferalTxData(linkMessage);

        const response = await fetch(`${API_BASE_URL}/user/wallet/link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet_address: currentAccount,
            referral_code: referralCode,
            signature: linkSignature,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Referral linking failed');
        }

        return result;
      } catch (error) {
        console.error('Referral linking error:', error);
        throw error;
      }
    },
    [currentAccount, signReferalTxData]
  );

  const handleSaveAndSign = async () => {
    if (!customReferralCode.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      await linkReferralCode(customReferralCode);
      toast.success('Referral code linked successfully!');

      await authenticateUser();
      toast.success('Authentication successful!');
      setCustomReferralDialog(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage('Wrong referral code. Please confirm your code is correct.');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveAndSign();
  };

  // const handleClose = () => {
  //   if (!isLoading) {
  //     setCustomReferralDialog(false);
  //   }
  // };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && customReferralCode.trim()) {
      e.preventDefault();
      handleSaveAndSign();
    }
  };

  useEffect(() => {
    const checkWalletAndAuthenticate = async () => {
      if (!currentAccount || isAuthenticated || hasAttemptedAuth || checkAuthStatus()) {
        return;
      }

      authAttemptedRef.current = currentAccount;

      try {
        setIsLoading(true);
        const hasReferralCode = await checkWalletReferralCode(currentAccount);
        if (hasReferralCode) {
          await authenticateUser();
          setCustomReferralDialog(false);
          toast.success('Wallet authenticated successfully!');
        } else {
          toast.error('Wallet authentication required. Please link a referral code.');
          setCustomReferralDialog(true);
        }
      } catch (error) {
        console.error('Error in wallet check and authentication:', error);
        toast.error('Failed to check wallet status. Please try again.');
        setCustomReferralDialog(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletAndAuthenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  useEffect(() => {
    if (authAttemptedRef.current !== currentAccount) {
      authAttemptedRef.current = null;
      setIsAuthenticated(false);
    }
  }, [currentAccount]);

  return (
    <Dialog
      open={customReferralDialog}
      onClose={(_, reason) => {
        if (!isLoading && reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          setCustomReferralDialog(false);
        }
      }}
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: '#1e293b',
          color: 'white',
          borderRadius: 2,
          p: 0,
        },
      }}
    >
      <form onSubmit={handleFormSubmit}>
        {/* Header */}
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            fontSize: '1.25rem',
            fontWeight: 500,
          }}
        >
          Link Referral Code
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 0 }}>
          <div
            style={{
              backgroundColor: '#21A88C2B',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>✓</span>
              </div>
              <div>
                <div style={{ color: '#21A88C', fontWeight: 600, fontSize: '14px' }}>
                  Wallet Connected
                </div>
                <div style={{ color: '#21A88C', fontSize: '12px' }}>
                  {currentAccount
                    ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
                    : ''}
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#201B1373',
                color: '#FFA828',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              No Linked Referral Code
            </div>
          </div>

          {/* Input Section */}
          <div style={{ marginBottom: '24px' }}>
            <p
              style={{
                color: '#A0A0A0',
                fontSize: '14px',
                marginBottom: '16px',
                lineHeight: 1.5,
                margin: '8px 0 16px 0',
              }}
            >
              Your wallet address is not linked to a referral code. Please enter a valid referral
              code to continue.
            </p>
            <TextField
              fullWidth
              placeholder="Enter Code"
              value={customReferralCode}
              onChange={(e) => {
                setCustomReferralCode(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#334155',
                  color: 'white',
                  borderRadius: '8px',
                  '& fieldset': { borderColor: errorMessage ? '#DC2626' : '#475569' },
                  '&:hover fieldset': { borderColor: errorMessage ? '#DC2626' : '#64748b' },
                  '&.Mui-focused fieldset': { borderColor: errorMessage ? '#DC2626' : '#21A88C' },
                },
                '& .MuiInputBase-input': {
                  padding: '12px 16px',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#94a3b8',
                  opacity: 1,
                },
              }}
            />
          </div>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={!customReferralCode.trim() || isLoading}
            sx={{
              bgcolor: '#475569',
              color: 'white',
              '&:hover': { bgcolor: '#64748b' },
              '&:disabled': { bgcolor: '#334155', color: '#64748b' },
              py: 1.5,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Processing...
              </>
            ) : (
              'Link Referral Code'
            )}
          </Button>

          {errorMessage && (
            <div
              style={{
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>!</span>
              </div>
              <div style={{ color: '#FCA5A5', fontSize: '14px', fontWeight: 500 }}>
                {errorMessage}
              </div>
            </div>
          )}

          <p
            style={{
              color: '#64748b',
              fontSize: '12px',
              textAlign: 'center',
              lineHeight: 1.4,
              margin: 0,
              width: '100%',
            }}
          >
            Connect your wallet to verify your referral. Please note that your referral only binds
            to the wallet you connect.
          </p>
        </DialogActions>
      </form>
    </Dialog>
  );
}

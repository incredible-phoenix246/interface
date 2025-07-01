/* eslint-disable react-hooks/exhaustive-deps */
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { useProfileStore } from './profile-store';

export default function CustomReferralDialog() {
  const {
    customReferralDialog,
    customReferralCode,
    setCustomReferralDialog,
    setCustomReferralCode,
    createCustomReferralCode,
    openSignatureRequest,
  } = useProfileStore();
  const { currentAccount, signReferalTxData, signAuthTxData } = useWeb3Context();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateAndLink = async () => {
      if (!currentAccount || isAuthenticated) return;

      const token = localStorage.getItem('access_token');
      if (token) {
        setIsAuthenticated(true);
        return;
      }

      try {
        const timestamp = new Date().toISOString();
        const authMessage = `Authenticate: ${timestamp}`;
        const authSignature = await signAuthTxData(authMessage);

        const authResponse = await fetch(
          'https://testnet-api.eden-finance.xyz/api/v1/user/wallet/auth',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              wallet_address: currentAccount,
              timestamp,
              signature: authSignature,
            }),
          }
        );

        const authResult = await authResponse.json();

        if (!authResponse.ok) {
          toast.error(authResult.message || 'Wallet authentication failed');
          setCustomReferralDialog(true);
          return;
        }

        if (authResult.access_token) {
          localStorage.setItem('access_token', authResult.access_token);
          setIsAuthenticated(true);
        }

        const linkMessage = 'Link referral for EdenFinance';
        const linkSignature = await signReferalTxData(linkMessage);

        const linkResponse = await fetch(
          'https://testnet-api.eden-finance.xyz/api/v1/user/wallet/link',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              wallet_address: currentAccount,
              referral_code: 'codemon', // replace with dynamic if needed
              signature: linkSignature,
            }),
          }
        );

        const linkResult = await linkResponse.json();

        if (!linkResponse.ok) {
          toast.error(linkResult.message || 'Referral linking failed');
          setCustomReferralDialog(true);
          return;
        }

        console.log('Referral link successful:', linkResult);
      } catch (error) {
        console.error('Auth/link error:', error);
        toast.error('Unexpected error occurred');
        setCustomReferralDialog(true);
      }
    };

    authenticateAndLink();
  }, [currentAccount, signAuthTxData, signReferalTxData, setCustomReferralDialog]);

  const handleSaveAndSign = () => {
    if (customReferralCode.trim()) {
      openSignatureRequest('referralCode', customReferralCode);
      createCustomReferralCode(customReferralCode);
    }
  };

  return (
    <Dialog
      open={customReferralDialog}
      onClose={() => setCustomReferralDialog(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a2332',
          color: 'white',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create Custom Referral Code
        <IconButton onClick={() => setCustomReferralDialog(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          placeholder="Enter custom code (e.g. codemon)"
          value={customReferralCode}
          onChange={(e) => setCustomReferralCode(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#0f172a',
              color: 'white',
              '& fieldset': { borderColor: '#374151' },
              '&:hover fieldset': { borderColor: '#6b7280' },
              '&.Mui-focused fieldset': { borderColor: '#10b981' },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#6b7280',
              opacity: 1,
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSaveAndSign}
          disabled={!customReferralCode.trim()}
          sx={{
            bgcolor: '#4f46e5',
            '&:hover': { bgcolor: '#4338ca' },
            '&:disabled': { bgcolor: '#374151' },
            py: 1.5,
            borderRadius: 1,
          }}
        >
          Save and Sign
        </Button>
      </DialogActions>
    </Dialog>
  );
}

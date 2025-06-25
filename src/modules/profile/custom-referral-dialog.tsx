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

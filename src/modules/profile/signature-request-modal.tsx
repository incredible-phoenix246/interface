import { CheckCircle, Close as CloseIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';

import { useProfileStore } from '../../store/profileSlice';

export default function SignatureRequestModal() {
  const { signatureRequest, closeSignatureRequest } = useProfileStore();

  const handleSign = () => {
    // Simulate signing process
    setTimeout(() => {
      closeSignatureRequest();
    }, 1000);
  };

  return (
    <Dialog
      open={signatureRequest.isOpen}
      onClose={closeSignatureRequest}
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
        Signature Request
        <IconButton onClick={closeSignatureRequest} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              bgcolor: '#0d4f3c',
              border: '1px solid #10b981',
              borderRadius: 1,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CheckCircle sx={{ color: '#10b981' }} />
            <Box>
              <Typography
                //@ts-expect-error next line
                variant="body2"
                sx={{ color: '#10b981', fontWeight: 600 }}
              >
                {signatureRequest.type === 'username' ? 'Username' : 'Referral Code'}
              </Typography>
              <Typography
                //@ts-expect-error next line
                variant="body2"
                sx={{ color: '#10b981' }}
              >
                {signatureRequest.data}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Alert
          severity="info"
          sx={{
            bgcolor: 'rgba(59, 130, 246, 0.1)',
            color: '#93c5fd',
            '& .MuiAlert-icon': { color: '#93c5fd' },
          }}
        >
          You are about to sign an authentication. This is gasless.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSign}
          sx={{
            bgcolor: '#4f46e5',
            '&:hover': { bgcolor: '#4338ca' },
            py: 1.5,
            borderRadius: 1,
          }}
        >
          Sign
        </Button>
      </DialogActions>
    </Dialog>
  );
}

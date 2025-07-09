import { CircularProgress } from '@mui/material';

export function GlobalLoading() {
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 1300,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        opacity: 0.9,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <CircularProgress size={40} style={{ color: '#21A88C' }} />
    </div>
  );
}

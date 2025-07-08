import { useState } from 'react';
import './App.css';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Box,
  Select,
  CircularProgress,
  Button,
  IconButton,
  Divider,
  SvgIcon
} from '@mui/material';
import axios from 'axios';

function CloseIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M18.3 5.71a1 1 0 00-1.41-1.41L12 9.59 7.11 4.7A1 1 0 105.7 6.11L10.59 11l-4.89 4.89a1 1 0 101.41 1.41L12 12.41l4.89 4.89a1 1 0 001.41-1.41L13.41 11l4.89-4.89z" />
    </SvgIcon>
  );
}

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // For modal: allow closing if running inside iframe
  const handleClose = () => {
    if (window.parent !== window) {
      // Try to close the modal by removing the parent element
      const modal = window.frameElement?.parentElement;
      if (modal) modal.remove();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/email/generate`, {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f6f8fc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Roboto, Arial, sans-serif',
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: 480 },
          boxShadow: 6,
          borderRadius: 3,
          bgcolor: 'white',
          p: 0,
          position: 'relative',
        }}
      >
        <CardHeader
          title={<Typography variant="h5" fontWeight={700}>AI Email Reply Generator</Typography>}
          subheader={<Typography variant="body2" color="text.secondary">Powered by Google Gemini</Typography>}
          action={
            <IconButton aria-label="close" onClick={handleClose} sx={{ display: { xs: 'none', sm: 'block' } }}>
              <CloseIcon />
            </IconButton>
          }
          sx={{ pb: 0, pt: 2, px: 3 }}
        />
        <Divider />
        <CardContent sx={{ px: 3, pt: 2, pb: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            label="Paste the original email here..."
            value={emailContent || ''}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 2 }}
            autoFocus
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tone (optional)</InputLabel>
            <Select
              value={tone || ''}
              label={"Tone (optional)"}
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
            </Select>
          </FormControl>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth
            size="large"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              py: 1.2,
              mt: 1,
              bgcolor: '#1976d2',
              ':hover': { bgcolor: '#1565c0' },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
          </Button>
        </CardContent>
        {generatedReply && (
          <>
            <Divider sx={{ mt: 2 }} />
            <CardContent sx={{ px: 3, pt: 2, pb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Generated Reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                value={generatedReply || ''}
                inputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                sx={{ mt: 1, borderRadius: 2, fontWeight: 600 }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
              >
                Copy to Clipboard
              </Button>
            </CardContent>
          </>
        )}
        <Box sx={{ textAlign: 'center', pb: 2, pt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            &copy; {new Date().getFullYear()} Gmail AI Reply Generator
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default App;

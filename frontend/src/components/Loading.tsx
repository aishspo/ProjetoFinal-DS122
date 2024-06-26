import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: "translate(-50%, -50%)"
        }}>
            <div style={{
                display: "flex",
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            </div>
        </div>
    );
}

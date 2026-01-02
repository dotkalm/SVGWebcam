import IconButton  from '@mui/material/IconButton';
import CameraSwitchIcon from '@mui/icons-material/Cameraswitch';

export default function CameraSwitch() {
    return (
        <IconButton
            sx={{
                left: '10px',
                top: '2dvh',
                position: 'absolute',
            }}
        >
            <CameraSwitchIcon sx={{ color: '#ff6f00' }} />
        </IconButton>
    );
}
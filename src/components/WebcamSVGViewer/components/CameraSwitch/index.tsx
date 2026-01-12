import IconButton  from '@mui/material/IconButton';
import CameraSwitchIcon from '@mui/icons-material/Cameraswitch';

export default function CameraSwitch() {
    return (
        <IconButton
            sx={{
                flex: 1,
            }}
        >
            <CameraSwitchIcon sx={{ color: '#ff6f00' }} />
        </IconButton>
    );
}
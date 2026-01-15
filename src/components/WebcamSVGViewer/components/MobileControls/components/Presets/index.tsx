import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import IconButton  from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { type TPresets } from '@/types';

export default function Presets({
    presets,
    presetName,
    setPresetName,
    savePreset,
    loadPreset,
    deletePreset,
}: TPresets) {
    const theme = useTheme();
    return (
        <Box
            sx={{
                width: '98dvw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1,
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                gap: 2,
                width: '100%',
                paddingX: '6dvw',
            }}>
                <Input
                    type="text"
                    placeholder="Preset name..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && savePreset()}
                    sx={{
                        flex: 20,
                        padding: 1,
                        paddingY: 1.5,
                        fontSize: '.8rem',
                        color: 'black !important',
                        border: `1px solid ${theme.palette.colors.border}`,
                        borderRadius: '4px',
                        outline: 'none',
                        height: '1.5dvh',
                    }}
                />
                <Button
                    onClick={savePreset}
                    sx={{
                        flex: 1,
                        padding: 1,
                        cursor: 'pointer',
                        backgroundColor: theme.palette.colors.activeBackground,
                        height: '1.5dvh',
                        color: theme.palette.colors.activeText,
                        borderRadius: '4px',
                        border: `1px solid ${theme.palette.colors.activeBorder}`,
                        fontSize: '.8rem',
                        paddingY: 1.5,
                    }}
                >
                    Save
                </Button>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    paddingX: '6dvw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                }}
            >
                <Box
                    sx={{
                        overflowY: 'auto',
                        width: '100%',
                        maxHeight: '6dvh',
                    }}
                >
                    {presets.length > 0 && (
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                            }}
                        >
                            {presets.map((preset, index) => (
                                <Box
                                    key={`${index}-${preset.name}`}
                                    sx={{
                                        py: 0.5,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 1,
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        alignContent: 'center',
                                    }}
                                >
                                    <Button
                                        sx={{
                                            backgroundColor: theme.palette.colors.background,
                                            border: `.4px solid ${theme.palette.colors.activeBorder}`,
                                            height: '2dvh',
                                                flex: 20,
                                                boxShadow: `2px 2px 0px rgba(0, 0, 0, 1)`,

                                        }}
                                        onClick={() => loadPreset(preset.settings)}
                                    >
                                        <Typography
                                            sx={{
                                                textAlign: 'right',
                                                fontSize: '.8rem',
                                                color: theme.palette.colors.activeBorder,
                                            }}
                                        >
                                            {preset.name}
                                        </Typography>
                                    </Button>
                                    <IconButton
                                        sx={{
                                            width: '100%',
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0,
                                            height: '1dvh',
                                            alignContent: 'center',
                                        }}
                                        onClick={() => deletePreset(index)}
                                    >
                                        <ClearIcon sx={{ color: "black" }} />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
                            /*
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    justifyItems: 'center',
                                    gap: 1,
                                    height: '1dvh',
                                }}
                            >
                                <Button
                                    onClick={() => loadPreset(preset.settings)}
                                    sx={{
                                        flex: 1,
                                        fontSize: '.6rem',
                                        cursor: 'pointer',
                                        border: 'none',
                                        borderRadius: '4px',
                                        textAlign: 'left',
                                    }}
                                >
                                    {preset.name}
                                </Button>
                                <Button
                                    onClick={() => deletePreset(index)}
                                    sx={{
                                        flex: 1,
                                        cursor: 'pointer',
                                        border: `1px solid ${theme.palette.colors.activeBorder}`,
                                        backgroundColor: theme.palette.colors.activeBackground,
                                        width: '1dvh',
                                        height: '1dvh',
                                    }}
                                >
                                    ✕
                                </Button>
                            </Box>
                            */
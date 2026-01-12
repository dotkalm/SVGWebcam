import { useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
    GaugeContainer,
    GaugeReferenceArc,
    useGaugeState,
} from '@mui/x-charts/Gauge';
import { 
    type TBlurProps,
    SubMenuItemBlur,
} from '@/types';
import { 
    sliderContainer,
    sliderStyles,
} from '@/styles/styles';
import { StyledSwitch } from '../Switch';

function GaugePointer() {
    const { valueAngle, cx, cy, innerRadius, outerRadius } = useGaugeState();
    
    if (valueAngle === null) {
        return null;
    }

    const target = {
        x: cx + outerRadius * Math.sin(valueAngle),
        y: cy - outerRadius * Math.cos(valueAngle),
    };
    
    return (
        <>
            <circle cx={cx} cy={cy} r={5} fill="red" />
            <path
                d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
                stroke="red"
                strokeWidth={3}
            />
        </>
    );
}

export default function Blur({ 
    blurMode,
    configs, 
    useBlur,
    motionBlurAngle,
}: TBlurProps) {
    const theme = useTheme();
    const blurLabel = !useBlur?.value ? 'Blur Off' : 'Blur On';
    const gaugeRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    
    const calculateAngleFromEvent = useCallback((clientX: number, clientY: number) => {
        if (!gaugeRef.current || !motionBlurAngle) return;
        
        const rect = gaugeRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        
        // Calculate angle in degrees (0° at top, clockwise)
        let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);
        
        // Normalize to 0-360
        if (angle < 0) {
            angle += 360;
        }
        
        motionBlurAngle.changeHandler(angle);
    }, [motionBlurAngle]);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        calculateAngleFromEvent(e.clientX, e.clientY);
    }, [calculateAngleFromEvent]);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isDraggingRef.current) {
            calculateAngleFromEvent(e.clientX, e.clientY);
        }
    }, [calculateAngleFromEvent]);

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
    }, []);

    return (
        <Box
            sx={{
                width: '98dvw',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    px: '4dvw',
                    gap: 2,
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        '& .MuiFormControlLabel-label': {
                            fontSize: '.8em !important',
                        }
                    }}
                >
                    <FormControlLabel
                        control={
                            <StyledSwitch
                                checked={useBlur.value}
                                slotProps={{ input: { 'aria-label': blurLabel } }}
                                onChange={useBlur.changeHandler}
                            />
                        }
                        label={blurLabel}
                    />
                </Box>
                {(!!motionBlurAngle && blurMode === SubMenuItemBlur.MOTION) && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5,
                        }}
                    >
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ fontSize: '.7em', mb: -1 }}
                        >
                            Angle: {Math.round(motionBlurAngle.value)}°
                        </Typography>
                        <Box
                            ref={gaugeRef}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            sx={{
                                cursor: 'pointer',
                                touchAction: 'none',
                                '& .MuiGauge-referenceArc': {
                                    fill: theme.palette.colors.border,
                                }
                            }}
                        >
                            <GaugeContainer
                                width={100}
                                height={100}
                                startAngle={0}
                                endAngle={360}
                                value={motionBlurAngle.value}
                            >
                                <GaugeReferenceArc />
                                <GaugePointer />
                            </GaugeContainer>
                        </Box>
                    </Box>
                )}
            </Box>
            {Object.keys(configs).map((label: string) => {
                const {
                    changeHandler,
                    max,
                    min,
                    step,
                    value,
                } = configs[label];
                return (
                    <Box
                        key={label}
                        sx={{
                            mb: 1,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            px: '4dvw',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignContent: 'flex-end',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Box sx={sliderContainer(theme)}>
                                <Slider
                                    max={max}
                                    min={min}
                                    onChange={changeHandler}
                                    size='small'
                                    step={step}
                                    sx={sliderStyles(theme)}
                                    value={value}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `${value.toFixed(3)}x`}
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'block', fontSize: '.8em' }}>
                                {label}
                            </Typography>
                            <br />
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'block', fontSize: '.8em' }}>
                                {value.toFixed(3)}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};
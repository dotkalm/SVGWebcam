import Box from '@mui/material/Box';
import { type TConfigProps, MenuItem, SubMenuItem } from '@/types';
import TwoSliders from '../TwoSliders';
import Stroke from '../Stroke';
import Fill from '../Fill';
import Submenu from '../SubMenu';

export default function Controls({ config, updateConfig }: TConfigProps) {
    const { activeMenuItem, activeSubMenuItem } = config;

    if (!activeMenuItem) {
        return null;
    }

    return (
        <>
            <Box
                sx={{
                    margin: '1dvw',
                    zIndex: 100010,
                    position: 'absolute',
                    top: '7dvh',
                    width: '98dvw',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    height: '16dvh',
                }}
            >
            <Submenu {...{ config, updateConfig }} />
                {activeMenuItem === MenuItem.EDGE_DETECTION && (
                    <TwoSliders
                        configs={{
                            'High Threshold': {
                                value: config.highThreshold,
                                min: 0.001,
                                max: 0.1,
                                step: 0.001,
                                changeHandler: (_, value) => updateConfig({ highThreshold: value as number }),
                            },
                            'Low Threshold': {
                                value: config.lowThreshold,
                                min: 0.001,
                                max: 0.1,
                                step: 0.001,
                                changeHandler: (_, value) => updateConfig({ lowThreshold: value as number }),
                            },
                        }}
                    />
                )}
                {((activeMenuItem === MenuItem.BACKGROUND_STYLING)
                    && (!activeSubMenuItem || activeSubMenuItem === SubMenuItem.FIDELITY))
                    && (
                        <TwoSliders
                            configs={{
                                'Threshold': {
                                    value: config.backgroundThreshold,
                                    min: 1,
                                    max: 255,
                                    step: 1,
                                    changeHandler: (_, value) => updateConfig({ backgroundThreshold: value as number }),
                                },
                                'Simplification': {
                                    value: config.backgroundSimplification,
                                    min: 1,
                                    max: 10,
                                    step: 0.5,
                                    changeHandler: (_, value) => updateConfig({ backgroundSimplification: value as number }),
                                },
                            }}
                        />
                    )
                }
                {(activeMenuItem === MenuItem.BACKGROUND_STYLING
                    && activeSubMenuItem === SubMenuItem.STROKE)
                    && (
                        <Stroke
                            configs={{
                                'Stroke Width': {
                                    value: config.backgroundStrokeWidth,
                                    min: 1,
                                    max: 255,
                                    step: 1,
                                    changeHandler: (_, value) => updateConfig({ backgroundStrokeWidth: value as number }),
                                },
                                'Stroke Opacity': {
                                    value: config.backgroundStrokeOpacity,
                                    min: 1,
                                    max: 10,
                                    step: 0.5,
                                    changeHandler: (_, value) => updateConfig({ backgroundStrokeOpacity: value as number }),
                                },
                            }}
                            strokeColor={{
                                value: config.backgroundStrokeColor,
                                changeHandler: (e) => updateConfig({ backgroundStrokeColor: e.target.value}),
                            }}
                        />
                    )
                }
                {(activeMenuItem === MenuItem.BACKGROUND_STYLING
                    && activeSubMenuItem === SubMenuItem.STYLE)
                    && (
                        <Fill
                            configs={{
                                'Fill Opacity': {
                                    value: config.backgroundFillOpacity,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                    changeHandler: (_, value) => updateConfig({ backgroundFillOpacity: value as number }),
                                },
                            }}
                            fillColor={{
                                value: config.backgroundFillColor,
                                changeHandler: (e) => updateConfig({ backgroundFillColor: e.target.value}),
                            }}
                            fillEnabled={{
                                value: config.useBackgroundFill,
                                changeHandler: () => updateConfig({ useBackgroundFill: !config.useBackgroundFill }),
                            }}
                            useBezierBackground={{
                                value: config.useBezierBackground,
                                changeHandler: () => updateConfig({ useBezierBackground: !config.useBezierBackground }),
                            }}
                            createWiggle={{
                                value: config.backgroundWiggle,
                                changeHandler: () => updateConfig({ backgroundWiggle: !config.backgroundWiggle }),
                            }}
                            createDashArray={{
                                value: config.backgroundUseDashArray,
                                changeHandler: () => updateConfig({ backgroundUseDashArray: !config.backgroundUseDashArray }),
                            }}
                            dashArray={{
                                value: config.backgroundDashSize,
                                min: 1,
                                max: 50,
                                step: 1,
                                changeHandler: (_, value) => updateConfig({ backgroundDashSize: value as number }),
                            }}
                        />
                    )
                }
            </Box>
        </>
    );
}
import Box from '@mui/material/Box';
import { type TConfigProps, MenuItem, SubMenuItem, SubMenuItemBlur } from '@/types';
import TwoSliders from '../TwoSliders';
import Stroke from '../Stroke';
import Fill from '../Fill';
import Submenu from '../SubMenu';
import Blur from '../Blur';

export default function Controls({ config, updateConfig }: TConfigProps) {
    const { activeMenuItem, activeSubMenuItem, blurMode } = config;

    if (!activeMenuItem) {
        return null;
    }

    return (
        <>
            <Box
                sx={{
                    margin: '1dvw',
                    zIndex: 100010,
                    width: '98dvw',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
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
                                    min: 0.01,
                                    max: 4,
                                    step: 0.01,
                                    changeHandler: (_, value) => updateConfig({ backgroundStrokeWidth: value as number }),
                                },
                                'Stroke Opacity': {
                                    value: config.backgroundStrokeOpacity,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
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
                {((activeMenuItem === MenuItem.OUTLINE)
                    && (!activeSubMenuItem || activeSubMenuItem === SubMenuItem.FIDELITY))
                    && (
                        <TwoSliders
                            configs={{
                                'Min Path Length': {
                                    value: config.outlinePathMinPathLength,
                                    min: 1,
                                    max: 20,
                                    step: 1,
                                    changeHandler: (_, value) => updateConfig({ outlinePathMinPathLength: value as number }),
                                },
                                'Simplification': {
                                    value: config.outlinePathSimplification,
                                    min: 1,
                                    max: 10,
                                    step: 0.5,
                                    changeHandler: (_, value) => updateConfig({ outlinePathSimplification: value as number }),
                                },
                            }}
                        />
                    )
                }
                {(activeMenuItem === MenuItem.OUTLINE
                    && activeSubMenuItem === SubMenuItem.STROKE)
                    && (
                        <Stroke
                            configs={{
                                'Stroke Width': {
                                    value: config.outlinePathsStrokeWidth,
                                    min: 0.01,
                                    max: 3,
                                    step: 0.01,
                                    changeHandler: (_, value) => updateConfig({ outlinePathsStrokeWidth: value as number }),
                                },
                                'Stroke Opacity': {
                                    value: config.outlinePathsStrokeWidth,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                    changeHandler: (_, value) => updateConfig({ outlinePathsStrokeWidth: value as number }),
                                },
                            }}
                            strokeColor={{
                                value: config.outlinePathsStrokeColor,
                                changeHandler: (e) => updateConfig({ outlinePathsStrokeColor: e.target.value}),
                            }}
                        />
                    )
                }
                {(activeMenuItem === MenuItem.OUTLINE
                    && activeSubMenuItem === SubMenuItem.STYLE)
                    && (
                        <Fill
                            configs={{
                                'Fill Opacity': {
                                    value: config.outlinePathsFillOpacity,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                    changeHandler: (_, value) => updateConfig({ outlinePathsFillOpacity: value as number }),
                                },
                            }}
                            fillColor={{
                                value: config.outlinePathsFillColor,
                                changeHandler: (e) => updateConfig({ outlinePathsFillColor: e.target.value}),
                            }}
                            fillEnabled={{
                                value: config.useOutlinePathsFill,
                                changeHandler: () => updateConfig({ useOutlinePathsFill: !config.useOutlinePathsFill }),
                            }}
                            useBezierBackground={{
                                value: config.useBezierOutlinePaths,
                                changeHandler: () => updateConfig({ useBezierOutlinePaths: !config.useBezierOutlinePaths }),
                            }}
                            createWiggle={{
                                value: config.outlinePathsWiggle,
                                changeHandler: () => updateConfig({ outlinePathsWiggle: !config.outlinePathsWiggle }),
                            }}
                            createDashArray={{
                                value: config.outlinePathsUseDashArray,
                                changeHandler: () => updateConfig({ outlinePathsUseDashArray: !config.outlinePathsUseDashArray }),
                            }}
                            dashArray={{
                                value: config.outlinePathsDashSize,
                                min: 1,
                                max: 50,
                                step: 1,
                                changeHandler: (_, value) => updateConfig({ outlinePathsDashSize: value as number }),
                            }}
                        />
                    )
                }
                {(activeMenuItem === MenuItem.BLUR
                    && blurMode === SubMenuItemBlur.GAUSSIAN)
                    && (
                        <Blur
                            configs={{
                                'Gaussian Blur Amount': {
                                    value: config.gaussianBlurAmount,
                                    min: 0,
                                    max: 10,
                                    step: .1,
                                    changeHandler: (_, value) => updateConfig({ gaussianBlurAmount: value as number }),
                                },
                            }}
                            blurMode={config.blurMode}
                            useBlur={{
                                value: !config.blurOff,
                                changeHandler: () => updateConfig({ blurOff: !config.blurOff }),
                            }}
                        />
                    )
                }
                {(activeMenuItem === MenuItem.BLUR
                    && blurMode === SubMenuItemBlur.MOTION)
                    && (
                        <Blur
                            configs={{
                                'Motion Blur Amount': {
                                    value: config.motionBlurAmount,
                                    min: 0,
                                    max: 150,
                                    step: 1,
                                    changeHandler: (_, value) => updateConfig({ motionBlurAmount: value as number }),
                                },
                            }}
                            blurMode={config.blurMode}
                            useBlur={{
                                value: !config.blurOff,
                                changeHandler: () => updateConfig({ blurOff: !config.blurOff }),
                            }}
                            motionBlurAngle={{
                                value: config.motionBlurAngle,
                                changeHandler: (value) => updateConfig({ motionBlurAngle: value }),
                            }}
                        />
                    )
                }
                {(activeMenuItem === MenuItem.BLUR
                    && blurMode === SubMenuItemBlur.BOKEH)
                    && (
                        <Blur
                            configs={{
                                'Aperture Size': {
                                    value: config.aperture,
                                    min: 0.01,
                                    max: 1.0,
                                    step: .01,
                                    changeHandler: (_, value) => updateConfig({ aperture: value as number }),
                                },
                            }}
                            blurMode={config.blurMode}
                            useBlur={{
                                value: !config.blurOff,
                                changeHandler: () => updateConfig({ blurOff: !config.blurOff }),
                            }}
                        />
                    )
                }
            </Box>
        </>
    );
}
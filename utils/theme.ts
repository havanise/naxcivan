import { createTheme } from "@shopify/restyle"
import { Dimensions } from "react-native"
const { width, height } = Dimensions.get("window")

const palette = {
    primary: '#37B874',
    secondary: '#373737',
    text: '#3E5481',
    white: '#ffffff',
    outline: '#D0DBEA',
    icon: '#3E5481',
    grey: '#505050',
    danger: '#d0021b',
    grey2: '#ebebeb'
}

export const theme = createTheme({
    colors: {
        primary: palette.primary,
        secondary: palette.secondary,
        text: palette.text,
        white: palette.white,
        outline: palette.outline,
        icon: palette.icon,
        danger: palette.danger,
        grey: palette.grey,
        grey2: palette.grey2
    },
    spacing: {
        s: '8px',
        m: '16px',
        l: '24px',
        xl: '40px',
        xxl: '80px'
    },
    radius: {
        o: 0,
        s: '5px',
        m: '12px',
        l: '24px',
        xl: '40px'
    },
    sizes: {
        width,
        height,
        widthInPixel: `${width}px`,
        heightInPixel: `${height}px`,
    },
    textVariants: {
        heading: {
            fontSize: 22,
            color: "white"
        }
    },
    breakpoints: {}
})
import {
    XP_LEVEL_COLORS_DEFAULT,
    XP_LEVEL_COLORS_LIGHT,
    XP_LEVEL_COLORS_DARK,
} from 'src/constants'

// const getIndexColor = (level) => {
//     if(XP_LEVEL_COLORS_DEFAULT.level - 1 < level) {
//         return XP_LEVEL_COLORS_DEFAULT
//     }
// }

export const getLevelColor = (variant = 'default', level = 0) => {
    if (variant === 'default') {
        return XP_LEVEL_COLORS_DEFAULT?.[level]
            ? XP_LEVEL_COLORS_DEFAULT[level]
            : XP_LEVEL_COLORS_DEFAULT[0]
    } else if (variant === 'light') {
        return XP_LEVEL_COLORS_LIGHT?.[level]
            ? XP_LEVEL_COLORS_LIGHT[level]
            : XP_LEVEL_COLORS_LIGHT[0]
    } else if (variant === 'dark') {
        return XP_LEVEL_COLORS_DARK?.[level]
            ? XP_LEVEL_COLORS_DARK[level]
            : XP_LEVEL_COLORS_DARK[0]
    }
}

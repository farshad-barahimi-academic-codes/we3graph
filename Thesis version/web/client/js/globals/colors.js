/**
 * Declares COLORS and COLOR_NAMES global variables.
 * Global variables declaration are restricted to this folder.
 * Colors from http://www.w3schools.com/html/html_colornames.asp
 */
function DeclareColors()
{
    COLORS = {};
    COLORS['White'] = 'FFFFFF';
    COLORS['Silver'] = 'C0C0C0';
    COLORS['Gray'] = '808080';
    COLORS['Black'] = '000000';

    COLORS['Pink'] = 'FFC0CB';
    COLORS['Purple'] = '800080';
    COLORS['Red'] = 'FF0000';
    COLORS['Dark red'] = '8B0000';
    COLORS['Saddle brown '] = '8B4513';

    COLORS['Ivory'] = 'FFFFF0';
    COLORS['Yellow'] = 'FFFF00';
    COLORS['Orange'] = 'FFA500';

    COLORS['Green'] = '008000';
    COLORS['Green yellow'] = 'ADFF2F';
    COLORS['Light green '] = '90EE90';
    COLORS['Dark green'] = '006400';

    COLORS['Cyan'] = '00FFFF';
    COLORS['Blue'] = '0000FF';
    COLORS['Dark blue'] = '00008B';
    COLORS['Sky blue'] = '87CEEB';

    COLOR_NAMES = Object.keys(COLORS);
}

DeclareColors();
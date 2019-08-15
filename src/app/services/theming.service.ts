import { Injectable, Inject } from '@angular/core';
import * as Color from 'color';
import { DOCUMENT } from '@angular/common';
import { BorrowedAppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {

  defaults: any;

  constructor(
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.defaults = {
      primary: "#3880FF",
      secondary: "#0CD1E8",
      tertiary: "#7044FF",
      success: "#10DC60",
      warning: "#FFCE00",
      danger: "#F04141",
      dark: "#222428",
      medium: "#989AA2",
      light: "#F4F5F8",
    }
  }

  setTheme(name: string) {
    const cssText = this.CSSTextGenrator(BorrowedAppConstants.THEMES[name]);
    this.setGlobalCSS(cssText);
  }

  private setGlobalCSS(cssText) {
    this._document.documentElement.style.cssText = cssText;
  }

  setGlobalVariable(name: string, value: string) {
    this._document.documentElement.style.setProperty(name, value);
  }

  private CSSTextGenrator(colors) {
    const themeColors = { ...this.defaults, ...colors };
    const {
      primary,
      secondary,
      tertiary,
      success,
      warning,
      danger,
      dark,
      medium,
      light
    } = themeColors;

    const shadeRatio = 0.1;
    const tintRatio = 0.1;

    return `
      --ion-color-base: ${light};
      --ion-color-contrast: ${dark};
      --ion-backgroud-color: ${light};
      --ion-text-color: ${dark};
      --ion-toolbar-backgroud-color: ${this.contrast(light, 0.1)};
      --ion-toolbar-text-color: ${this.contrast(dark, 0.1)};
      --ion-item-backgroud-color: ${this.contrast(light, 0.3)};
      --ion-item-text-color: ${this.contrast(dark, 0.3)};

      --ion-color-primary: ${primary};
      --ion-color-primary-rgb: 89,46,90;
      --ion-color-primary-contrast: ${this.contrast(primary)};
      --ion-color-primary-contrast-rgb: 255,255,255;
      --ion-color-primary-shade: ${Color(primary).darken(shadeRatio)};
      --ion-color-primary-tint: ${Color(primary).lighten(tintRatio)};

      --ion-color-secondary: ${secondary};
      --ion-color-secondary-rgb: 7,7,235;
      --ion-color-secondary-contrast: ${this.contrast(secondary)};
      --ion-color-secondary-contrast-rgb: 255,255,255;
      --ion-color-secondary-shade: ${Color(secondary).darken(shadeRatio)};
      --ion-color-secondary-tint: ${Color(secondary).lighten(tintRatio)};

      --ion-color-tertiary: ${tertiary};
      --ion-color-tertiary-rgb: 166,136,255;
      --ion-color-tertiary-contrast: ${this.contrast(tertiary)};
      --ion-color-tertiary-contrast-rgb: 0,0,0;
      --ion-color-tertiary-shade: ${Color(tertiary).darken(shadeRatio)};
      --ion-color-tertiary-tint: ${Color(tertiary).lighten(tintRatio)};

      --ion-color-success: ${success};
      --ion-color-success-rgb: 68,162,36;
      --ion-color-success-contrast: ${this.contrast(success)};
      --ion-color-success-contrast-rgb: 255,255,255;
      --ion-color-success-shade: ${Color(success).darken(shadeRatio)};
      --ion-color-success-tint: ${Color(success).lighten(tintRatio)};

      --ion-color-warning: ${warning};
      --ion-color-warning-rgb: 213,170,0;
      --ion-color-warning-contrast: ${this.contrast(warning)};
      --ion-color-warning-contrast-rgb: 0,0,0;
      --ion-color-warning-shade: ${Color(warning).darken(shadeRatio)};
      --ion-color-warning-tint: ${Color(warning).lighten(tintRatio)};

      --ion-color-danger: ${danger};
      --ion-color-danger-rgb: 245,61,61;
      --ion-color-danger-contrast: ${this.contrast(danger)};
      --ion-color-danger-contrast-rgb: 255,255,255;
      --ion-color-danger-shade: ${Color(danger).darken(shadeRatio)};
      --ion-color-danger-tint: ${Color(danger).lighten(tintRatio)};

      --ion-color-dark: ${dark};
      --ion-color-dark-rgb: 73,78,86;
      --ion-color-dark-contrast: ${this.contrast(dark)};
      --ion-color-dark-contrast-rgb: 255,255,255;
      --ion-color-dark-shade: ${Color(dark).darken(shadeRatio)};
      --ion-color-dark-tint: ${Color(dark).lighten(tintRatio)};

      --ion-color-medium: ${medium};
      --ion-color-medium-rgb: 205,206,209;
      --ion-color-medium-contrast: ${this.contrast(medium)};
      --ion-color-medium-contrast-rgb: 0,0,0;
      --ion-color-medium-shade: ${Color(medium).darken(shadeRatio)};
      --ion-color-medium-tint: ${Color(medium).lighten(tintRatio)};

      --ion-color-light: ${light};
      --ion-color-light-rgb: 240,243,244;
      --ion-color-light-contrast: ${this.contrast(light)};
      --ion-color-light-contrast-rgb: 0,0,0;
      --ion-color-light-shade: ${Color(light).darken(shadeRatio)};
      --ion-color-light-tint: ${Color(light).lighten(tintRatio)};

      --ion-background-color: color(--ion-color-primary-shade);//	Background color of entire app
      --ion-background-color-rgb: color(--ion-color-primary-shade); //	Background color of entire app, rgb format
      --ion-text-color: color(--ion-color-primary-shade);//	Text color of entire app
      --ion-text-color-rgb: color(--ion-color-primary-shade);//	Text color of entire app, rgb format
      --ion-backdrop-color: color(--ion-color-primary-shade);//	Color of the Backdrop component
      --ion-overlay-background-color: color(--ion-color-primary-shade);//	Background color of the overlays
      --ion-border-color: color(--ion-color-primary-shade);//	Border color
      --ion-box-shadow-color: color(--ion-color-primary-shade);//	Box shadow color
      --ion-tab-bar-background: color(--ion-color-primary-shade);//	Background of the Tab bar
      --ion-tab-bar-background-focused: color(--ion-color-primary-shade);//	Background of the focused Tab bar
      --ion-tab-bar-border-color: color(--ion-color-primary-shade);//	Border color of the Tab bar
      --ion-tab-bar-color: color(--ion-color-primary-shade);//	Color of the Tab bar
      --ion-tab-bar-color-activated: color(--ion-color-primary-shade);//	Color of the activated Tab
      --ion-toolbar-background: color(--ion-color-primary-shade);//	Background of the Toolbar
      --ion-toolbar-border-color: color(--ion-color-primary-shade);//	Border color of the Toolbar
      --ion-toolbar-color: color(--ion-color-primary-shade);//	Color of the components in the Toolbar
      --ion-toolbar-color-activated: color(--ion-color-primary-shade);//Color of the activated components in the Toolbar
      --ion-toolbar-color-unchecked: color(--ion-color-primary-shade);//	Color of the unchecked components in the Toolbar
      --ion-toolbar-color-checked: color(--ion-color-primary-shade);//	Color of the checked components in the Toolbar
      --ion-item-background: color(--ion-color-primary-shade);//	Background of the Item
      --ion-item-background-activated: color(--ion-color-primary-shade);//	Background of the activated Item
      --ion-item-border-color: color(--ion-color-primary-shade);//	Border color of the Item
      --ion-item-color: color(--ion-color-primary-shade);//	Color of the components in the Item
      --ion-placeholder-color: color(--ion-color-primary-shade);//	Color of the placeholder in inputs

    `;
  }

  private contrast(colorVal, ratio = 0.8) {
    const color = Color(colorVal);
    return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
  }
}

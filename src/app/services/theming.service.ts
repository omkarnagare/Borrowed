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

    // if (Color(themeColors.primary).isDark()) {
    //   const temp = themeColors.dark;
    //   themeColors.dark = themeColors.light
    //   themeColors.light = temp;
    // }

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

    const shadeRatio = 0.2;
    const tintRatio = 0.2;

    return `
      --ion-color-primary: ${primary};
      --ion-color-primary-rgb: ${Color(primary).red()}, ${Color(primary).green()}, ${Color(primary).blue()};
      --ion-color-primary-contrast: ${this.contrast(primary)};
      --ion-color-primary-contrast-rgb: ${Color(this.contrast(primary)).red()}, ${Color(this.contrast(primary)).green()}, ${Color(this.contrast(primary)).blue()};
      --ion-color-primary-shade: ${Color(primary).darken(shadeRatio)};
      --ion-color-primary-tint: ${Color(primary).lighten(tintRatio)};

      --ion-color-secondary: ${secondary};
      --ion-color-secondary-rgb: ${Color(secondary).red()}, ${Color(secondary).green()}, ${Color(secondary).blue()};
      --ion-color-secondary-contrast: ${this.contrast(secondary)};
      --ion-color-secondary-contrast-rgb: ${Color(this.contrast(secondary)).red()}, ${Color(this.contrast(secondary)).green()}, ${Color(this.contrast(secondary)).blue()};
      --ion-color-secondary-shade: ${Color(secondary).darken(shadeRatio)};
      --ion-color-secondary-tint: ${Color(secondary).lighten(tintRatio)};

      --ion-color-tertiary: ${tertiary};
      --ion-color-tertiary-rgb: ${Color(tertiary).red()}, ${Color(tertiary).green()}, ${Color(tertiary).blue()};
      --ion-color-tertiary-contrast: ${this.contrast(tertiary)};
      --ion-color-tertiary-contrast-rgb: ${Color(this.contrast(tertiary)).red()}, ${Color(this.contrast(tertiary)).green()}, ${Color(this.contrast(tertiary)).blue()};
      --ion-color-tertiary-shade: ${Color(tertiary).darken(shadeRatio)};
      --ion-color-tertiary-tint: ${Color(tertiary).lighten(tintRatio)};

      --ion-color-success: ${success};
      --ion-color-success-rgb: ${Color(success).red()}, ${Color(success).green()}, ${Color(success).blue()};
      --ion-color-success-contrast: ${this.contrast(success)};
      --ion-color-success-contrast-rgb: ${Color(this.contrast(success)).red()}, ${Color(this.contrast(success)).green()}, ${Color(this.contrast(success)).blue()};
      --ion-color-success-shade: ${Color(success).darken(shadeRatio)};
      --ion-color-success-tint: ${Color(success).lighten(tintRatio)};

      --ion-color-warning: ${warning};
      --ion-color-warning-rgb: ${Color(warning).red()}, ${Color(warning).green()}, ${Color(warning).blue()};
      --ion-color-warning-contrast: ${this.contrast(warning)};
      --ion-color-warning-contrast-rgb: ${Color(this.contrast(warning)).red()}, ${Color(this.contrast(warning)).green()}, ${Color(this.contrast(warning)).blue()};
      --ion-color-warning-shade: ${Color(warning).darken(shadeRatio)};
      --ion-color-warning-tint: ${Color(warning).lighten(tintRatio)};

      --ion-color-danger: ${danger};
      --ion-color-danger-rgb: ${Color(danger).red()}, ${Color(danger).green()}, ${Color(danger).blue()};
      --ion-color-danger-contrast: ${this.contrast(danger)};
      --ion-color-danger-contrast-rgb: ${Color(this.contrast(danger)).red()}, ${Color(this.contrast(danger)).green()}, ${Color(this.contrast(danger)).blue()};
      --ion-color-danger-shade: ${Color(danger).darken(shadeRatio)};
      --ion-color-danger-tint: ${Color(danger).lighten(tintRatio)};

      --ion-color-dark: ${dark};
      --ion-color-dark-rgb: ${Color(dark).red()}, ${Color(dark).green()}, ${Color(dark).blue()};
      --ion-color-dark-contrast: ${this.contrast(dark)};
      --ion-color-dark-contrast-rgb: ${Color(this.contrast(dark)).red()}, ${Color(this.contrast(dark)).green()}, ${Color(this.contrast(dark)).blue()};
      --ion-color-dark-shade: ${Color(dark).darken(shadeRatio)};
      --ion-color-dark-tint: ${Color(dark).lighten(tintRatio)};

      --ion-color-medium: ${medium};
      --ion-color-medium-rgb: ${Color(medium).red()}, ${Color(medium).green()}, ${Color(medium).blue()};
      --ion-color-medium-contrast: ${this.contrast(medium)};
      --ion-color-medium-contrast-rgb: ${Color(this.contrast(medium)).red()}, ${Color(this.contrast(medium)).green()}, ${Color(this.contrast(medium)).blue()};
      --ion-color-medium-shade: ${Color(medium).darken(shadeRatio)};
      --ion-color-medium-tint: ${Color(medium).lighten(tintRatio)};

      --ion-color-light: ${light};
      --ion-color-light-rgb: ${Color(light).red()}, ${Color(light).green()}, ${Color(light).blue()};
      --ion-color-light-contrast: ${this.contrast(light)};
      --ion-color-light-contrast-rgb: ${Color(this.contrast(light)).red()}, ${Color(this.contrast(light)).green()}, ${Color(this.contrast(light)).blue()};
      --ion-color-light-shade: ${Color(light).darken(shadeRatio)};
      --ion-color-light-tint: ${Color(light).lighten(tintRatio)};
    `;
  }

  private contrast(colorVal, ratio = 0.8) {
    const color = Color(colorVal);
    // return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
    return color.isDark() ? Color("#ffffff") : Color("#000000");
  }
}

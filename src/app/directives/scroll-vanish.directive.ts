import { Directive, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[scrollVanish]'
})
export class ScrollVanishDirective implements OnInit {
  @Input("scrollVanish") scrollArea;

  private triggerUnit: number = 25;

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2,
    private _domController: DomController
  ) {}

  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe(scrollEvent => {
      let delta = scrollEvent.detail.deltaY;
      let top = scrollEvent.detail.scrollTop;
      // console.log("top", top, "delta", delta);
      if (top > 4 * this.triggerUnit && delta >= 0 ) {

        this.hideCompletely();

      } else if (top > 3 * this.triggerUnit && delta >= 0 ) {

        this.showQuarter();

      } else if (top > 2 * this.triggerUnit && delta >= 0 ) {

        this.showHalf();

      } else if (top > this.triggerUnit && delta >= 0 ) {

        this.showThreeQuarters();

      } else if (top >= 0 && top < this.triggerUnit) {

        this.showCompletely();

      } else if (top < 2 * this.triggerUnit && delta <= 0 ) {

        this.showThreeQuarters();

      } else if (top < 3 * this.triggerUnit && delta <= 0 ) {

        this.showHalf();

      } else if (top <= 4 * this.triggerUnit && delta <= 0 ) {

        this.showQuarter();

      }
    });
  }

  initStyles() {
    this._domController.write(() => {
      this._renderer.setStyle(
        this._element.nativeElement,
        "transition",
        "0.2s linear"
      );
      this._renderer.setStyle(this._element.nativeElement, "height", "56px");
    });
  }

  showCompletely() {
    this._domController.write(() => {
      this._renderer.setStyle(this._element.nativeElement, "height", "56px");
      // this._renderer.removeStyle(this._element.nativeElement, "opacity");
      this._renderer.removeStyle(this._element.nativeElement, "min-height");
      this._renderer.removeStyle(this._element.nativeElement, "padding");
    });
  }

  showQuarter() {
    this._domController.write(() => {
      this._renderer.setStyle(this._element.nativeElement, "min-height", "0px");
      this._renderer.setStyle(this._element.nativeElement, "height", "14px");
      // this._renderer.setStyle(this._element.nativeElement, "opacity", "0.25");
      this._renderer.setStyle(this._element.nativeElement, "padding", "0");
    });
  }

  showHalf() {
    this._domController.write(() => {
      this._renderer.setStyle(this._element.nativeElement, "min-height", "0px");
      this._renderer.setStyle(this._element.nativeElement, "height", "28px");
      // this._renderer.setStyle(this._element.nativeElement, "opacity", "0.5");
      this._renderer.setStyle(this._element.nativeElement, "padding", "0");
    });
  }

  showThreeQuarters() {
    this._domController.write(() => {
      this._renderer.setStyle(this._element.nativeElement, "min-height", "0px");
      this._renderer.setStyle(this._element.nativeElement, "height", "42px");
      // this._renderer.setStyle(this._element.nativeElement, "opacity", "0.75");
      this._renderer.setStyle(this._element.nativeElement, "padding", "0");
    });
  }

  hideCompletely() {
    this._domController.write(() => {
      this._renderer.setStyle(this._element.nativeElement, "min-height", "0px");
      this._renderer.setStyle(this._element.nativeElement, "height", "0px");
      // this._renderer.setStyle(this._element.nativeElement, "opacity", "0");
      this._renderer.setStyle(this._element.nativeElement, "padding", "0");
    });
  }
}
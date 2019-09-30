import { Directive, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[scrollVanish]'
})
export class ScrollVanishDirective implements OnInit {
  @Input("scrollVanish") scrollArea;

  private hidden: boolean = false;
  private triggerDistance: number = 20;

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2,
    private _domController: DomController
  ) {}

  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe(scrollEvent => {
      let delta = scrollEvent.detail.deltaY;

      if (scrollEvent.detail.currentY === 0 && this.hidden) {
        this.show();
      } else if (!this.hidden && delta > this.triggerDistance) {
        this.hide();
      } else if (this.hidden && delta < -this.triggerDistance) {
        this.show();
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

  hide() {
    this._domController.write(() => {
      this._renderer.setStyle(this._element.nativeElement, "min-height", "0px");
      this._renderer.setStyle(this._element.nativeElement, "height", "0px");
      this._renderer.setStyle(this._element.nativeElement, "opacity", "0");
      this._renderer.setStyle(this._element.nativeElement, "padding", "0");
    });

    this.hidden = true;
  }

  show() {
    this._domController.write(() => {
      this._renderer.setStyle(this._element.nativeElement, "height", "56px");
      this._renderer.removeStyle(this._element.nativeElement, "opacity");
      this._renderer.removeStyle(this._element.nativeElement, "min-height");
      this._renderer.removeStyle(this._element.nativeElement, "padding");
    });

    this.hidden = false;
  }
}
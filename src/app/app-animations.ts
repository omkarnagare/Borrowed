import { Animation } from '@ionic/core'

export function alertEnterAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    const wrapperAnimation = new AnimationC();
    const wrapperElem = baseEl.querySelector('.alert-wrapper') as HTMLElement;
    wrapperAnimation.addElement(wrapperElem);

    wrapperElem.style.top = '0';

    backdropAnimation.fromTo('opacity', 0.01, 0.3);
    wrapperAnimation.beforeStyles({ 'opacity': 1 });

    const random = Math.floor(Math.random() * 4) + 1;
    switch (random) {
        case 1:
            wrapperAnimation.fromTo('transform', `translateY(-${baseEl.clientHeight}px)`, 'translateY(0px)');
            break;
        case 2:
            wrapperAnimation.fromTo('transform', `translateX(-${baseEl.clientWidth}px)`, 'translateX(0px)');
            break;
        case 3:
            wrapperAnimation.fromTo('transform', `translateX(+${baseEl.clientWidth}px)`, 'translateX(0px)');
            break;
        case 4:
            wrapperAnimation.fromTo('transform', `translateY(+${baseEl.clientHeight}px)`, 'translateY(0px)');
            break;
    }
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36, .66, .3, .1, 1)')
        .duration(500)
        .add(wrapperAnimation)
        .add(backdropAnimation));
}

export function alertLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    const wrapperAnimation = new AnimationC();
    const wrapperElem = baseEl.querySelector('.alert-wrapper') as HTMLElement;
    wrapperAnimation.addElement(wrapperElem);

    wrapperElem.style.top = '0';

    backdropAnimation.fromTo('opacity', 0.3, 0.01);
    wrapperAnimation.beforeStyles({ 'opacity': 1 });

    const random = Math.floor(Math.random() * 4) + 1;
    switch (random) {
        case 1:
            wrapperAnimation.fromTo('transform', 'translateY(0px)', `translateY(+${baseEl.clientHeight}px)`);
            break;
        case 2:
            wrapperAnimation.fromTo('transform', 'translateX(0px)', `translateX(+${baseEl.clientWidth}px)`);
            break;
        case 3:
            wrapperAnimation.fromTo('transform', 'translateX(0px)', `translateX(-${baseEl.clientWidth}px)`);
            break;
        case 4:
            wrapperAnimation.fromTo('transform', 'translateX(0px)', `translateX(-${baseEl.clientHeight}px)`);
            break;
    }
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36, .66, .3, .1, 1)')
        .duration(500)
        .add(wrapperAnimation)
        .add(backdropAnimation));
}

export function toastEnterAnimation(AnimationC: Animation, baseEl: ShadowRoot, position: string): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const wrapperAnimation = new AnimationC();
    const hostEl = (baseEl.host || baseEl) as HTMLElement;
    const wrapperEl = baseEl.querySelector('.toast-wrapper') as HTMLElement;
    wrapperAnimation.addElement(wrapperEl);

    wrapperAnimation.fromTo('opacity', 0.01, 1);
    switch (position) {
        case 'top':
            wrapperEl.style.top = `calc(8px + var(--ion-safe-area-top, 0px))`;
            break;
        case 'middle':
            const topPosition = Math.floor(
                hostEl.clientHeight / 2 - wrapperEl.clientHeight / 2
            );
            wrapperEl.style.top = `${topPosition}px`;
            break;
        case 'bottom':
            wrapperEl.style.bottom = `calc(8px + var(--ion-safe-area-bottom, 0px))`;
            break;
    }
    wrapperAnimation.fromTo('transform', `translateX(-${hostEl.clientWidth}px)`, 'translateX(0px)');

    return Promise.resolve(baseAnimation
        .addElement(hostEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(500)
        .add(wrapperAnimation));
}

export function toastLeaveAnimation(AnimationC: Animation, baseEl: ShadowRoot, position: string): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const wrapperAnimation = new AnimationC();
    const hostEl = (baseEl.host || baseEl) as HTMLElement;
    const wrapperEl = baseEl.querySelector('.toast-wrapper') as HTMLElement;
    wrapperAnimation.addElement(wrapperEl);

    wrapperAnimation.fromTo('opacity', 1, 0.01);
    switch (position) {
        case 'top':
            wrapperEl.style.top = `calc(8px + var(--ion-safe-area-top, 0px))`;
            break;
        case 'middle':
            const topPosition = Math.floor(
                hostEl.clientHeight / 2 - wrapperEl.clientHeight / 2
            );
            wrapperEl.style.top = `${topPosition}px`;
            break;
        case 'bottom':
            wrapperEl.style.bottom = `calc(8px + var(--ion-safe-area-bottom, 0px))`;
            break;
    }
    wrapperAnimation.fromTo('transform', 'translateX(0px)', `translateX(+${hostEl.clientWidth}px)`);
    
    return Promise.resolve(baseAnimation
        .addElement(hostEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(500)
        .add(wrapperAnimation));
}
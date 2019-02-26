import { trigger, state, style, animate, transition } from '@angular/animations';

export const FADE_IN_OUT = trigger('fadeInOut',
  [
    transition(':enter', [
      style({opacity:0}),
      animate(200, style({opacity:1}))
    ]),
    transition(':leave', [
      animate(200, style({opacity:0}))
    ])
  ]
)

export const FADE_IN_OUT_WITH_HEIGHT_VARIANCE = trigger('fadeInOutHeight',
  [
    transition(':enter', [
      style({opacity:0,height:0}),
      animate(100, style({opacity:1,height:'*'}))
    ]),
    transition(':leave', [
      animate(100, style({opacity:0,height:0}))
    ])
  ]
)

export const APPEARING_NO_DELAY = trigger('appearingAnimNoDelay',
  [
    transition(':enter', [
      style({opacity:0,transform:'scale(0)',height:0,width:0}),
      animate(100, style({opacity:1,transform:'scale(1.2)',height:'*',width:'*'})),
      animate(80, style({transform:'scale(1)'}))
    ]),
    transition(':leave', [
      animate(80, style({transform:'scale(1.2)',height:'*',width:'*'})),
      animate(100, style({opacity:0,transform:'scale(0)',height:0,width:0}))
    ])
  ]
)
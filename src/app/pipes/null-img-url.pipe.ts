import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullImgUrl'
})
export class NullImgUrlPipe implements PipeTransform {

  transform( value: string ): string {
    if ( !value )
      return 'assets/images/sidenav/2x/avatar.png'
    return value
  }

}

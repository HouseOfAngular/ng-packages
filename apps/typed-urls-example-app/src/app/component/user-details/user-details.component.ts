import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../model/user.interface';

@Component({
  selector: 'app-user-details[user]',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent {
  @Input() user?: User | null;
}

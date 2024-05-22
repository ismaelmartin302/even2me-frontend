import { Component, Input } from '@angular/core';
import { IApiResponseUser } from '../../services/models/user-api.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  @Input({ required: true }) user?: IApiResponseUser;
}

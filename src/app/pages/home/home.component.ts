import { Component, inject, Input, OnInit } from '@angular/core';
import { UsersApiService } from '../../services/users-api.service';
import { HttpClientModule } from '@angular/common/http';
import { IApiResponseUser } from '../../services/models/user-api.interface';
import { UserComponent } from '../../records/user/user.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, UserComponent],
  providers: [UsersApiService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly _usersApiService = inject(UsersApiService)
  users: IApiResponseUser[] = [];
  ngOnInit(): void {
      this._usersApiService.getUsers().subscribe((data) => (this.users = data))
  }
}

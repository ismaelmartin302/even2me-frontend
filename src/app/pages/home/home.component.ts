import { Component, inject, OnInit } from '@angular/core';
import { UsersApiService } from '../../services/users-api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule],
  providers: [UsersApiService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly _usersApiService = inject(UsersApiService)
  ngOnInit(): void {
      this._usersApiService.getUsers().subscribe((users) => console.log(users))
  }
}

import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/shared/services/event.service';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-pending-deliverers',
  templateUrl: './pending-deliverers.component.html',
  styleUrls: ['./pending-deliverers.component.css']
})
export class PendingDeliverersComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService, private eventService: EventService) {
    this.loadUsers();
    this.eventService.isMealAdded.subscribe(data => {
      this.loadUsers();
    })     
   }

   loadUsers(){
    this.userService.getPendingDeliverers().subscribe(
      data => {
        console.log(data);
        this.users = data
      },
      error => {

      }
    )

   }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Verify } from 'src/app/shared/models/verify.model';
import { EventService } from 'src/app/shared/services/event.service';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-pending-user',
  templateUrl: './pending-user.component.html',
  styleUrls: ['./pending-user.component.css']
})
export class PendingUserComponent implements OnInit {
  user?: User
  status: string = "Pending"
  @Input('user') set ord (user: User){
    this.status = user.pendingStatus.split('.')[1];
    this.user = user;
  }


  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private toastr: ToastrService, 
    private router: Router,
    private eventService: EventService
    ) { }

  verifyUser(accept: boolean){
    // first show dialog
    let desc = "Are you sure that you want to accept user with username: " + this.user?.username + "as deliverer?";
    if(!accept){
      desc = "Are you sure that you want to deny apply by user with username: " + this.user?.username + "?";
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Warning', description: desc}
    },);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        // add order
        let verify = new Verify();
        verify.user_email = this.user!.email;
        verify.verify = accept;

        this.userService.verifyUser(verify).subscribe(data => {
          if(accept)
            this.toastr.success("User successfully accepted!");
          else
            this.toastr.success("User successfully denied!");
          
          this.eventService.isMealAdded.next(true);
        },
        error => {
          this.toastr.error("Unable to proccess.")
          console.log(error);
        }
        );
      }
    });
  }

  ngOnInit(): void {
  }

}

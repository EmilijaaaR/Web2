import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { User } from 'src/app/user/models/user.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-apply-for-deliverer',
  templateUrl: './apply-for-deliverer.component.html',
  styleUrls: ['./apply-for-deliverer.component.css']
})
export class ApplyForDelivererComponent implements OnInit {

  user?: User

  pendingStatus: string = ""

  constructor(private userService: UserService, public dialog: MatDialog, private toastr: ToastrService) {
    this.userService.getUser().subscribe(
      data => {
        console.log(data);
        this.user = data;
        this.pendingStatus = this.user.pendingStatus.split('.')[1];
      },
      error => {

      }
    )
  }

  ngOnInit(): void {
  }

  onApply(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Deliverer', description: 'Are you sure that you want to apply for deliverer position?'}
    },);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.userService.applyForDeliverer().subscribe(
          data => {
            this.toastr.success('You are successfully applied');
            this.pendingStatus = "PENDING"
          },
          error => {
            this.toastr.error('Unable to apply.');
          }
        )
      }
    });
  }

}

import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  title?: String
  description?: String

  
  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, description: string}) {
    this.title = data.title;
    this.description = data.description;
   }

  ngOnInit(): void {
  }

}

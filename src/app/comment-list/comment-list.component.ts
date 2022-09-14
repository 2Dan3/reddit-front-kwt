import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { Comment } from './model/comment.model';
import { CommentService } from './services/comment.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  comments: Comment[] = [];
  private form_visibility = false;

  @Input()
  post_id! :string|number;

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    protected authService: AuthService,
    private router: Router,

    )
    {
      // console.log(this.post_id);
      this.apiService.get("/posts/"+ this.route.snapshot.params['id'] + "/comments")
      .subscribe(
        (res) => {
          this.comments = [];

          for(let res_obj of res) {
            this.comments.push(new Comment(res_obj));
          }

        },
        (_error) => {
          console.log(JSON.stringify(_error));
        }
      );
     }

  ngOnInit(): void {
    this.comments = this.commentService.getAll();
  }

  protected showForm(){
    this.form_visibility = true;
  }

  protected hideForm(){
    this.form_visibility = false;
  }

  protected isFormActive(){
    return this.form_visibility == true;
  }

  protected saveComment(commentObj : any){
    //  TODO* remove the URL's Trailing "1"
    this.apiService.post("/posts/"+ this.route.snapshot.params['id'] + "/comments/1", commentObj)
      .subscribe(
        (res) => {
          this.post_id = this.route.snapshot.params['id'];
          // window.location.reload();

        },
        (_error) => {
          console.log(JSON.stringify(_error));
        }
      );
  }

}

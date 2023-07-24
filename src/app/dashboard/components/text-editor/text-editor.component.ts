import { Component, OnDestroy, OnInit, ViewEncapsulation, VERSION } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Validators, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class TextEditorComponent implements OnInit, OnDestroy {
  name = 'Angular ' + VERSION.major;
  editor: Editor = new Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  html$ = '';
  get html(): string {
    return this.html$;
  }
  set html(html: string) {
    this.html$ = html;
    this.fixTentative = html.replace(/<p><\/p>/ig, '<p><br><\/p>');
  }
  fixTentative = '';

  form = new FormGroup({
    editorContent: new FormControl(

      Validators.required()
    ),
  });



  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}



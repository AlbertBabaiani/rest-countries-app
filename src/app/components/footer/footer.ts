import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  imports: [MatToolbarModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  githubUrl = 'https://github.com/AlbertBabaiani';
  profileImageUrl = 'https://github.com/AlbertBabaiani.png';
  authorName = 'Albert Babaiani';
}

import { Component, Input  } from '@angular/core';

@Component({
    selector: 'op-tree-view',
    templateUrl: './treeview.component.html',
    // styleUrls: ['./tree-view.css']
})

export class TreeViewComponent {
    @Input() links: any;
    isCollapsedMM: any;

}

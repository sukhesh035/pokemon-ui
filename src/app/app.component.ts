import { Component, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AppComponent {
  public title = 'pokemon-ui';
  public dataSource = new MatTableDataSource();
  public columnsToDisplay = ['name', 'url'];
  public expandedElement: null = null;
  public detailObj: any = {};
  public totalCount: number = 0;
  public itemsPerPage: number = 15;
  public pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: this.itemsPerPage,
    length: this.totalCount,
  };

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getPokemonList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getPokemonList() {
    this.http
      .get(
        `http://localhost:3000/getPokemonList?Limit=${this.itemsPerPage}&Offset=${
          this.pageEvent?.pageIndex ?? 1
        }`
      )
      .subscribe((res: any) => {
        this.totalCount = res.count;
        this.dataSource = new MatTableDataSource(res.results);
      });
  }

  pageChangeEvent(event: PageEvent) {
    this.pageEvent = event;
    this.getPokemonList();
  }

  getPokemonByName(name: String) {
    this.http
      .get(`http://localhost:3000/getPokemonByName?Name=${name}`)
      .subscribe((res: any) => {
        this.detailObj = res;
      });
  }
}

import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { SpreadsheetModel } from '../models/spreadsheet.model';
import { MODEL_API_URL } from '../../../app/shared/constants/shared.constants';
@Injectable()
export class DataCollectionService
{
	readOnlyModel:any;
	rows:Array<Row>;
    current:Column;
    start:number;
    end:number;
    visibleRows = [];
    header = [];    
    columnsCount: number = 0;
	constructor(private http: Http, @Inject(MODEL_API_URL) private apiURL) {}
	get readonlyDataModel() : Observable<any> {
		return this.http.get(this.apiURL).map(res => this.extractReadOnlyModelData(res.json()));
	}
	public extractReadOnlyModelData(jsonModel: any) : any {
	//jsonModel = this.keysToLowerCase(jsonModel);
	let topLevelSection = jsonModel.TABLE.SECTIONS[0]; 
	this.readOnlyModel = new SpreadsheetModel(topLevelSection.ROWS.length,topLevelSection.ROWS[0].CELLS.length);
	//jsonModel.forEach((model)=> 
	 		//{	 
	 			this.header= [];
	 			this.unalteredReadonlymodel = jsonModel;
	 			this.rows = [];
	        	this.start = 0;
	        	this.end, this.readOnlyModel.rowCount = topLevelSection.ROWS.length;
	        	this.readOnlyModel.useLineNumber = topLevelSection.SECTION_DETAILS.USELINENUMBER;

	        	let columnIndex = 0 ;
	 			topLevelSection.ROWS[0].CELLS.forEach((cell)=> 
                 {
	                this.header.push({	DISPLAYTEXT : cell.DISPLAYTEXT, colSpan: cell.COLSPAN , startingColumnIndex : columnIndex, rowSpan : cell.ROWSPAN,
	                					endingColumnIndex: columnIndex += cell.SPAN });
                    columnIndex += cell.COLSPAN;
                    this.columnsCount += cell && cell.COLSPAN ? cell.COLSPAN : 1;
                 });     

	 			let rowCnt = 0;
	 			jsonModel.TABLE.SECTIONS.forEach((eachSection, idx) => {
	 				for(let i = 0; i < eachSection.ROWS.length; i++)
					{	
						if(idx===0 && i===0) {
							/* since we have already taken the first column of the first row for rending the header purpose so ignoring */
							continue;
						}
						this.rows.push(new Row(rowCnt++,this.columnsCount,eachSection.ROWS[i].CELLS));
		        	}	
	 			})
					 			
	//});
		this.readOnlyModel.rows= this.rows;
		this.readOnlyModel.header = this.header;
		return this.readOnlyModel;
	}	
	public getSheetHeaders() : any[] {
		return this.header;	
	}
	public getVisibleRows()	{
        return this.readOnlyModel.rows.filter((row) => row.rowIndex >= this.readOnlyModel.start && row.rowIndex < this.readOnlyModel.end);
    }
    public getCurrentCell() {
    	return new Column(0,1,"");
    }
    _unalteredReadonlyModel : any;
    public get unalteredReadonlymodel() {
    	return this._unalteredReadonlyModel;
    }
    public set unalteredReadonlymodel(val) {
    	this._unalteredReadonlyModel = val;
    }
}

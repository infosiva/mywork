export class Column{
    cellValue:String;
    constructor(public columnIndex: number,
    			public rowIndex: number,
    			public displayText: string ="",
    			public isHeader: boolean =false, 
    			public uniqueId : string ="", 
    			public colSpan : string = "1", 
    			public rowSpan : string ="1",
    			public cellType: string ="input",
    			public content: string =""
                )
    {
    }
}

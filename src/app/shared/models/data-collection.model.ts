export class DataCollectionModel
{
	constructor(public tables: Table[],public metaData: Metadata)
	{
		
	}
}

export class Metadata
{
	constructor(public name: string, public id: string, public isHeader : boolean=false)
	{

	}
}

export class Table
{
	constructor(public metadata: Metadata, public rows: Rows[])
	{
		
	}
}

export class Rows
{
	constructor(public metadata: Metadata, public cells: Cell[])
	{

	}
}

export class Cell
{
	constructor
			(
				public id: number, 
				public displayText: string, 
				public value: string, 
				public isReadonly: boolean=false,
				public isEditable: boolean=false,
				public isHeader: boolean= false
			)
	{

	}
}


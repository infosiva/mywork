const companyInternalRightClickMenuOptions = [
        {DisplayText: 'View/Edit data validation rules', CellType: 'validation', DisplayModal: true, icon: 'fa fa-edit', CellColor: '#FFFFE0', iconColor: 'green'},        
        {DisplayText: 'ReadOnly/Non-Editable', CellType: 'Readonly', icon: 'fa fa-lock', CellColor: 'lightgrey', iconColor: 'red'},
        {DisplayText: 'Required/Mandatory', CellType: 'Requied', icon: 'fa fa-star', CellColor: 'lightgrey', iconColor: 'red'},
        {DisplayText: 'No-Display for external users', CellType: 'NoDisplay', icon: 'fa fa-user-times', CellColor: 'lightgrey', iconColor: 'green'},
        {DisplayText: 'Delete the validation rules', icon: 'fa fa-trash-o', CellColor: '', 'MethodToExecute': 'deleteAppliedRules', iconColor: 'green'},
        {DisplayText: 'Reset selections', icon: 'fa fa-undo', CellColor: '', 'MethodToExecute': 'resetSelections', iconColor: 'green'},
      ];
const cellStyles = [
	{'HeaderColor' : 'yellow'},
	{'NormalCellColor': ''}
]
export const MODEL_API_URL = "src/api/model_multisec.json";
export let constants = 	{ 
							'companyInternalRightClickMenuOptions': companyInternalRightClickMenuOptions,
							'cellStyles': cellStyles
					   	};
export let storageConstants = { 
        validationModeStorageKey : 'validationModeKey',
        dataFeedingModeStorageKey : 'dataFeedingModeKey',
        modelBuildingModeStorageKey : 'modelBuildingModeKey'
}

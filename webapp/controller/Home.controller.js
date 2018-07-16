sap.ui.define([
	'jquery.sap.global',
	"sap/ui/core/mvc/Controller",
	'sap/m/GroupHeaderListItem',
	'sap/ui/model/Filter',
	'sap/ui/model/Sorter'
], function(jQuery, Controller, GroupHeaderListItem,Filter,Sorter) {
	"use strict";

	return Controller.extend("com.axyt.chapter4unit2.controller.Home", {
		_oDialog: null,
		
		onInit:function(){
			this.mGroupFunctions = {
				Name: function(oContext) {
					var name = oContext.getProperty("Name");
					return {
						key: name,
						text: name
					};
				}
			};
		},
		
		handleDelete: function(oEvent) {
			var oItem = oEvent.getParameter("listItem");
			var oModel = this.getView().getModel();
			var sPath = oItem.getBindingContext().getPath();
			var iLength = sPath.length;
			var iIndex = sPath.slice(iLength - 1);
			var jsonData = oModel.getData();
			jsonData.Products.splice(iIndex, 1);
			oModel.refresh();
		},
		
		getGroupHeader: function (oGroup){
			return new GroupHeaderListItem( {
				title: oGroup.key,
				upperCase: false
			} );
		},
		
		onUpdateSortFilter: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.axyt.chapter4unit2.view.TableViewSetting", this);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		
		onSetDone: function(oEvent) {

			var oView = this.getView();
			var oTable = oView.byId("table0");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var sPath;
			var bDescending;
			var vGroup;
			var aSorters = [];
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);

			// apply filters to binding
			var aFilters = [];
			jQuery.each(mParams.filterItems, function (i, oItem) {
				var aSplit = oItem.getKey().split("___");
				var sPath = aSplit[0];
				var sOperator = aSplit[1];
				var sValue1 = aSplit[2];
				var sValue2 = aSplit[3];
				var oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});
			oBinding.filter(aFilters);
		},
		
		onAddNew: function(evt){
			var newName = this.byId("inputName").getValue();
			var desc = this.byId("inputDescription").getValue();
			var datePicker = this.byId("inputDate").getValue();
			var nameInsert = {"Name" : newName, "Description" : desc, "ReleaseDate" : datePicker };
			this.getView().getModel().getProperty("/Products").push(nameInsert);
			this.getView().getModel().refresh();
		},
		
		onExit : function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		}
	});
});
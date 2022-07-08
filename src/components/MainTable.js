import React, { useMemo, Fragment } from "react";
import {
	useTable,
	useFilters,
	useGlobalFilter,
	useSortBy,
	usePagination,
} from "react-table";
import { createColumns } from "./createColumn";
import "./table.css";
import { GlobalFilter } from "./GlobalFilter";
import { ColumnFilter } from "./ColumnFilter";
import { ReadOnlyRow } from "./ReadOnlyRow";
import { EditableRow } from "./EditableRow";
import { useParams } from "react-router-dom";

import PEOPLE_DATA from "../data/PEOPLE_DATA.json";
import { peopleColumn } from "../data/peopleColumn";
import APP_DATA from "../data/APP_DATA.json";
import { appColumn } from "../data/appColumn";
import COMMERCE_DATA from "../data/COMMERCE_DATA.json";
import { commerceColumn } from "../data/commerceColumn";
import MEDICINE_DATA from "../data/MEDICINE_DATA.json";
import { medicineColumn } from "../data/medicineColumn";

export const MainTable = () => {
	const { id } = useParams();
	console.log(id);

	let COL, DATAS;
	switch (id) {
		case "user_info":
			DATAS = PEOPLE_DATA;
			COL = peopleColumn;
			break;
		case "applications":
			DATAS = APP_DATA;
			COL = appColumn;
			break;
		case "commerce":
			DATAS = COMMERCE_DATA;
			COL = commerceColumn;
			break;
		case "medicine":
			DATAS = MEDICINE_DATA;
			COL = medicineColumn;
			break;
		default:
			DATAS = PEOPLE_DATA;
			COL = peopleColumn;
			break;
	}
	const columns = useMemo(() => createColumns(COL), [COL]);
	console.log(columns);
	const [data, setData] = React.useState(useMemo(() => DATAS, [DATAS]));

	const defaultColumn = React.useMemo(
		() => ({
			Filter: ColumnFilter,
		}),
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		nextPage,
		previousPage,
		canNextPage,
		canPreviousPage,
		pageOptions,
		gotoPage,
		pageCount,
		setPageSize,
		prepareRow,
		state,
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
		},
		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const { pageIndex, globalFilter, pageSize } = state;

	const [editFormData, setEditFormData] = React.useState(
		peopleColumn.reduce((o, key) => ({ ...o, [key]: "" }), {})
	);

	const handleEditFormChange = (e) => {
		e.preventDefault();

		const fieldName = e.target.getAttribute("name");
		const fieldValue = e.target.value;

		const newFormData = { ...editFormData };
		newFormData[fieldName] = fieldValue;

		setEditFormData(newFormData);
	};

	const [editRowId, setEditRowId] = React.useState(null);

	const handleEditClick = (event, row) => {
		event.preventDefault();
		setEditRowId(row.id);

		const formValues = { ...row.values };
		setEditFormData(formValues);
	};

	const handleEditFormSubmit = (e) => {
		e.preventDefault();

		const editedRow = { ...editFormData };
		const index = data.findIndex((row) => row.id === editRowId);
		const newData = [...data];
		newData[index] = editedRow;
		setData(newData);
		setEditRowId(null);
	};

	return (
		<>
			<h1>{id}</h1>
			<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
			<form onSubmit={(e) => handleEditFormSubmit(e)}>
				<table {...getTableProps()}>
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th {...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render("Header")}
										<span>
											{column.isSorted
												? column.isSortedDesc
													? " 🔽"
													: " 🔼"
												: ""}
										</span>
										<div>
											{column.canFilter ? column.render("Filter") : null}
										</div>
									</th>
								))}
								<th>Actions</th>
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{page.map((row) => (
							<Fragment>
								{editRowId === row.id ? (
									<EditableRow
										row={row}
										prepareRow={prepareRow}
										editFormData={editFormData}
										handleEditFormChange={handleEditFormChange}
									/>
								) : (
									<ReadOnlyRow
										row={row}
										prepareRow={prepareRow}
										handleEditClick={handleEditClick}
									/>
								)}
							</Fragment>
						))}
					</tbody>
				</table>
			</form>
			<div>
				<span>
					Page{" "}
					<strong>
						{pageIndex + 1} of {pageOptions.length}
					</strong>
				</span>
				<span>
					{" "}
					| Go to page:{" "}
					<input
						type="number"
						defaultValue={pageIndex + 1}
						onChange={(e) => {
							const pageNumber = e.target.value
								? Number(e.target.value) - 1
								: 0;
							gotoPage(pageNumber);
						}}
						style={{ width: "50px" }}
					/>
				</span>
				<select
					value={pageSize}
					onChange={(e) => setPageSize(Number(e.target.value))}
				>
					{[10, 25, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select>
				<button onClick={() => gotoPage("0")} disabled={!canPreviousPage}>
					{"<<"}
				</button>
				<button onClick={() => previousPage()} disabled={!canPreviousPage}>
					Previous
				</button>
				<button onClick={() => nextPage()} disabled={!canNextPage}>
					Next
				</button>
				<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
					{">>"}
				</button>
			</div>
			<h2>Add a row</h2>
			<form style={{ marginBottom: "50px" }}>
				{columns.map((column) => {
					return (
						<input
							id={column.accessor + "input"}
							type="text"
							name={column.accessor}
							required="required"
							placeholder={`Enter ${column.accessor}`}
							style={{ marginRight: "10px", width: "200px" }}
						/>
					);
				})}
				<button type="submit">Add row</button>
			</form>
		</>
	);
};

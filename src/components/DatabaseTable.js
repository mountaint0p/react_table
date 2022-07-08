import React, { useMemo } from "react";
import { databaseNames } from "../data/databaseNames";
import { ColumnFilter } from "./ColumnFilter";
import { GlobalFilter } from "./GlobalFilter";
import {
	useTable,
	useFilters,
	useGlobalFilter,
	useSortBy,
	usePagination,
} from "react-table";
import { Link } from "react-router-dom";

export const DatabaseTable = () => {
	const columns = useMemo(
		() => [
			{
				Header: "Table Names",
				accessor: "name",
			},
		],
		[]
	);

	const data = useMemo(() => databaseNames, []);

	const defaultColumn = useMemo(
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

	const { globalFilter } = state;

	return (
		<>
			<h1>Database Tables</h1>
			<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
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
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell) => {
									const link = `/table/${cell.value}`;
									return (
										<td {...cell.getCellProps()}>
											<Link to={link} _hover={{ textDecoration: "none" }}>
												{cell.render("Cell")}
											</Link>
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
};

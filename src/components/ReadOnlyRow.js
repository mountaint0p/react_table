import React from "react";

export const ReadOnlyRow = ({ row, prepareRow, handleEditClick }) => {
	prepareRow(row);
	return (
		<tr {...row.getRowProps()}>
			{row.cells.map((cell) => {
				return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
			})}
			<td>
				<button type="button" onClick={(e) => handleEditClick(e, row)}>
					Edit
				</button>
				<button type="button">Delete</button>
			</td>
		</tr>
	);
};

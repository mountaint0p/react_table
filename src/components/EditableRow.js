import React from "react";

export const EditableRow = ({
	row,
	prepareRow,
	editFormData,
	handleEditFormChange,
}) => {
	prepareRow(row);
	console.log(editFormData);
	return (
		<tr {...row.getRowProps()}>
			{row.cells.map((cell) => {
				const name = cell.column.id;
				return (
					<td {...cell.getCellProps()}>
						<input
							type="text"
							required="required"
							placeholder="Enter a new value..."
							name={name}
							value={editFormData[name]}
							onChange={handleEditFormChange}
						/>
					</td>
				);
			})}
			<td>
				<button type="submit">Save</button>
				<button type="button">Cancel</button>
			</td>
		</tr>
	);
};

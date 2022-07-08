export const createColumns = (columnName) => {
	return columnName.map((name) => {
		const col = {
			Header: name,
			accessor: name,
			sticky: "left",
		};
		return col;
	});
};

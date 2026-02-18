export const paginateResponse = (result, page, limit) => {
  const data = result[0].data;
  const totalItems = result[0].total.length > 0 ? result[0].total[0].count : 0;
  const next = page * limit < totalItems;
  const prev = page > 1;
  const from = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  const paginator = {
    items: data.length,
    totalItems,
    next,
    prev,
    from,
    to,
    currentPage: page
  };

  return { data, paginator };
};

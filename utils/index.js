export const paginateResponse = (result, page, limit)=> {
     const data = result[0].data;
        const totalItems = result[0].total.length > 0 ? result[0].total[0].count : 0;
        const next = page * limit < totalItems;
        const prev = page > 1;
      
        const paginator = {
          items: data.length,
          totalItems,
          next,
          prev,
        };

        return {data, paginator}
}
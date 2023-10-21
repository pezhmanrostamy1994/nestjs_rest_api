import { PaginateDb, SetPaginate } from '../../interface/public.interface';
export async function paginate({
  page,
  limit, 
  model,
  data,
  searchQuery,
}:SetPaginate): Promise<PaginateDb> {
  const docs =data[0].data;
  const totalDocs = await model.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalDocs / +limit) || 1;
  const prevPage = +page - 1 || null;
  const nextPage = +limit * +page < totalDocs ? +page + 1 : null;
  return {
    docs,
    totalDocs,
    totalPages,
    page:+page,
    limit:+limit,
    hasNextPage: !!nextPage,
    hasPrevPage: !!prevPage,
    prevPage,
    nextPage,
  };
}

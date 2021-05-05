import React from 'react';

const Pagination = ({currentPage, itemPerPage, length, onPageChange}) => {
     
     const pageCount = Math.ceil(length/itemPerPage);
     const pages = [];
 
     for(let i = 1; i<=pageCount; i++)
     {
        pages.push(i);
     }
     console.log(pages);


     
     


    return (<>
     <div>
  <ul className="pagination pagination-sm">
    <li className={"page-item" + (currentPage === 1 && " disabled")}>
      <button className="page-link" onClick={()=> onPageChange(currentPage - 1)}>&laquo;</button>
    </li>
    {pages.map(page=> <li key={page} className={"page-item" + (currentPage === page && " active")}>
      <button className="page-link" onClick={()=> onPageChange(page)}>{page}</button>
    </li>)}
    
    
    <li className={"page-item" + (currentPage === pageCount && " disabled")}>
      <button className="page-link" onClick={()=> onPageChange(currentPage + 1)}>&raquo;</button>
    </li>
  </ul>
</div>
    </>);
};

Pagination.getData = (items, currentPage, itemPerPage)=>{
//d'où on part(start) et pendant combien de temps (itemPerPage)
const start = (currentPage * itemPerPage) - itemPerPage;
return items.slice(start, start + itemPerPage);
}
 
export default Pagination;
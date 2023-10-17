import { Stack } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";

export function PaginationControl({ pageable, config, onClick }) {
  const firstPageNumber = config?.firstPageNumber || 0;
  const lastPageNumber = pageable.totalPages - 1 + firstPageNumber;
  const startFromOne = (number) => number + 1 - firstPageNumber;
  let items = [];
  if (pageable.totalPages > 5) {
    items.push(
      <Pagination.First
        disabled={pageable.first}
        onClick={() => onClick(firstPageNumber)}
        key="firstPage"
      />,
    );
    items.push(
      <Pagination.Prev
        disabled={pageable.first}
        onClick={() => onClick(pageable.pageNumber - 1)}
        key="prevPage"
      />,
    );
  }
  if (pageable.totalPages > 5) {
    if (config?.ellipsis && pageable.pageNumber - firstPageNumber > 2) {
      items.push(<Pagination.Ellipsis key="prevEllipsis" />);
    }
    let beginNumber = Math.max(firstPageNumber, pageable.pageNumber - 2);
    let endNumber = Math.min(pageable.pageNumber + 2, lastPageNumber);
    if (pageable.pageNumber - beginNumber < 2) {
      endNumber = Math.min(firstPageNumber + 4, lastPageNumber);
    } else if (endNumber - pageable.pageNumber < 2) {
      beginNumber = Math.max(firstPageNumber, endNumber - 4);
    }
    console.debug(beginNumber, endNumber);
    for (let number = beginNumber; number <= endNumber; number++) {
      items.push(
        <Pagination.Item
          active={number === pageable.pageNumber}
          onClick={() => onClick(number)}
          key={number}
        >
          {startFromOne(number)}
        </Pagination.Item>,
      );
    }
    if (config?.ellipsis && pageable.totalPages - pageable.pageNumber > 2) {
      items.push(<Pagination.Ellipsis key="nextEllipsis" />);
    }
  } else {
    for (
      let number = firstPageNumber;
      number < pageable.totalPages - firstPageNumber;
      number++
    ) {
      items.push(
        <Pagination.Item
          active={number === pageable.pageNumber}
          onClick={() => onClick(number)}
          key={number}
        >
          {startFromOne(number)}
        </Pagination.Item>,
      );
    }
  }
  if (pageable.totalPages > 5) {
    items.push(
      <Pagination.Next
        disabled={pageable.last}
        onClick={() => onClick(pageable.pageNumber + 1)}
        key="nextPage"
      />,
    );
    items.push(
      <Pagination.Last
        disabled={pageable.last}
        onClick={() => onClick(lastPageNumber)}
        key="lastPage"
      />,
    );
  }
  return (
    <Stack direction="horizontal">
      Showing {pageable.numberOfElements} of {pageable.totalElements} total
      items, {pageable.totalPages} pages
      <Pagination className="ms-auto">{items}</Pagination>
    </Stack>
  );
}

export function fromSpringPage(data) {
  return {
    first: data.first,
    last: data.last,
    pageNumber: data.number,
    totalPages: data.totalPages,
    numberOfElements: data.numberOfElements,
    totalElements: data.totalElements,
    firstPageNumber: 0,
    pageSize: data.size,
  };
}

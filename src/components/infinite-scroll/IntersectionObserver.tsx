import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useFetchMockData from '../../hooks/useFetchMockData';

export const IntersectionObserver = () => {
  const { ref, inView } = useInView();

  const { flatData, totalDBRowCount, totalFetched, hasMore, isLoading, isFetching, fetchNextPage } = useFetchMockData({
    queryKey: ['intersection-observer'],
  });

  useEffect(() => {
    if (inView && hasMore) {
      fetchNextPage();
    }
  }, [inView, hasMore, fetchNextPage]);

  return (
    <div className="w-96">
      <div className="p-2.5">
        <h1 className="text-xl">intersection observer</h1>
      </div>
      <div className="overflow-auto border border-solid border-gray-500 h-[calc(100vh-90px)]">
        <div className="list-none">
          {flatData.map((comment) => (
            <li key={comment.id} ref={ref} className="p-5 mb-3 bg-gray-200 border border-solid border-gray-400">
              <span>
                [{comment.no}] {comment.email}
              </span>
              <p>{comment.body}</p>
            </li>
          ))}
          {(isLoading || isFetching) && <li className="px-3 pb-3 text-center">Loading...</li>}
        </div>
      </div>
      <div className="p-2.5">
        Fetched <strong>{totalFetched}</strong> of <strong>{totalDBRowCount}</strong> Rows.
      </div>
    </div>
  );
};

export default IntersectionObserver;

"use client"

import { useInfiniteScroll } from "@/hooks/infinite-scroll"
import Skeleton from "./skeleton"

type Props = {
  action: "GROUPS" | "POSTS"
  children: React.ReactNode
  paginate: number
  identifier: string
  search?: boolean
  loading?: "POST"
}

const InfiniteScrollObserver = ({
  children,
  loading,
}: Props) => {
  const { observerElement, isFetching } = useInfiniteScroll()

  return (
    <>
      {children}
      <div ref={observerElement}>
        {isFetching && <Skeleton element={loading || "CARD"} />}
      </div>
    </>
  )
}

export default InfiniteScrollObserver
